import { Injectable } from '@nestjs/common';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infra/database/drizzle.service';
import { pedidos } from 'src/infra/database/schemas/order.table';
import { pedidoItens } from 'src/infra/database/schemas/order-items.table';
import { ingressos } from 'src/infra/database/schemas/ticket.table';
import { tipoIngresso } from 'src/infra/database/schemas/ticket-order.table';
import { CreateOrdersBody } from './dtos/order.dto';
import { BadRequestError, NotFoundError } from 'src/core/erros/http.errors';

@Injectable()
export class OrdersService {
  constructor(private readonly db: DrizzleService) {}

  async create(userId: string, dto: CreateOrdersBody) {
    const ids = dto.itens.map((i) => i.tipoIngressoId);

    const tipos = await this.db
      .getInstance()
      .select()
      .from(tipoIngresso)
      .where(inArray(tipoIngresso.id, ids));

    if (tipos.length !== ids.length) {
      const encontrados = new Set(tipos.map((t) => t.id));
      const ausente = ids.find((id) => !encontrados.has(id));
      throw new NotFoundError({
        message: `Tipo de ingresso não encontrado: ${ausente}`,
      });
    }

    const now = new Date();

    for (const item of dto.itens) {
      const tipo = tipos.find((t) => t.id === item.tipoIngressoId)!;

      if (!tipo.ativo) {
        throw new BadRequestError({
          message: `Tipo de ingresso "${tipo.nome}" está inativo`,
        });
      }

      if (now < new Date(tipo.inicioVenda) || now > new Date(tipo.fimVenda)) {
        throw new BadRequestError({
          message: `Tipo de ingresso "${tipo.nome}" está fora do período de venda`,
        });
      }

      const disponivel = tipo.quantidadeTotal - tipo.quantidadeVendida;
      if (item.quantidade > disponivel) {
        throw new BadRequestError({
          message: `Ingresso "${tipo.nome}": quantidade solicitada (${item.quantidade}) excede o disponível (${disponivel})`,
        });
      }
    }

    const quantidadeTotal = dto.itens.reduce((acc, i) => acc + i.quantidade, 0);

    return this.db.getInstance().transaction(async (tx) => {
      const [pedido] = await tx
        .insert(pedidos)
        .values({ userId, quantidadeTotal, status: 'PENDENTE' })
        .returning();

      await tx.insert(pedidoItens).values(
        dto.itens.map((item) => {
          const tipo = tipos.find((t) => t.id === item.tipoIngressoId)!;
          return {
            pedidoId: pedido.id,
            tipoIngressoId: item.tipoIngressoId,
            eventoId: tipo.eventoId,
            quantidade: item.quantidade,
            precoUnitario: tipo.preco,
          };
        }),
      );

      return pedido;
    });
  }

  async findAll(userId: string) {
    return this.db
      .getInstance()
      .select()
      .from(pedidos)
      .where(eq(pedidos.userId, userId));
  }

  async findOne(userId: string, id: string) {
    const [pedido] = await this.db
      .getInstance()
      .select()
      .from(pedidos)
      .where(and(eq(pedidos.id, id), eq(pedidos.userId, userId)))
      .limit(1);

    if (!pedido) {
      throw new NotFoundError({ message: 'Pedido não encontrado' });
    }

    return pedido;
  }

  async pay(userId: string, id: string) {
    const pedido = await this.findOne(userId, id);

    if (pedido.status !== 'PENDENTE') {
      throw new BadRequestError({
        message: `Pedido não pode ser pago pois está com status "${pedido.status}"`,
      });
    }

    const itens = await this.db
      .getInstance()
      .select()
      .from(pedidoItens)
      .where(eq(pedidoItens.pedidoId, id));

    return this.db.getInstance().transaction(async (tx) => {
      const [pedidoPago] = await tx
        .update(pedidos)
        .set({ status: 'PAGO' })
        .where(eq(pedidos.id, id))
        .returning();

      for (const item of itens) {
        await tx
          .update(tipoIngresso)
          .set({
            quantidadeVendida: sql`${tipoIngresso.quantidadeVendida} + ${item.quantidade}`,
          })
          .where(eq(tipoIngresso.id, item.tipoIngressoId));

        const novosIngressos = Array.from({ length: item.quantidade }, () => ({
          pedidoId: id,
          eventoId: item.eventoId,
          userId,
          status: 'VALIDO' as const,
        }));

        await tx.insert(ingressos).values(novosIngressos);
      }

      return pedidoPago;
    });
  }

  async cancel(userId: string, id: string) {
    const pedido = await this.findOne(userId, id);

    if (pedido.status !== 'PENDENTE') {
      throw new BadRequestError({
        message: `Pedido não pode ser cancelado pois está com status "${pedido.status}"`,
      });
    }

    const [cancelado] = await this.db
      .getInstance()
      .update(pedidos)
      .set({ status: 'CANCELADO' })
      .where(eq(pedidos.id, id))
      .returning();

    return cancelado;
  }
}
