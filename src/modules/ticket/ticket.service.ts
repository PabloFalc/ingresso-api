import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infra/database/drizzle.service';
import { tipoIngresso } from 'src/infra/database/schemas/ticket-order.table';
import { eventos } from 'src/infra/database/schemas/event.table';
import type {
  CreateTicketType,
  UpdateTicketType,
} from './dtos/ticket-type.schema';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from 'src/core/erros/http.errors';

@Injectable()
export class TicketsService {
  constructor(private readonly db: DrizzleService) {}

  private async assertOrganizador(eventoId: string, userId: string) {
    const [evento] = await this.db
      .getInstance()
      .select()
      .from(eventos)
      .where(eq(eventos.id, eventoId))
      .limit(1);

    if (!evento) {
      throw new NotFoundError({ message: 'Evento não encontrado' });
    }

    if (evento.organizadorId !== userId) {
      throw new ForbiddenError({
        message:
          'Somente o organizador do evento pode gerenciar tipos de ingresso',
      });
    }

    return evento;
  }

  private async findTipoOrThrow(id: string) {
    const [tipo] = await this.db
      .getInstance()
      .select()
      .from(tipoIngresso)
      .where(eq(tipoIngresso.id, id))
      .limit(1);

    if (!tipo) {
      throw new NotFoundError({ message: 'Tipo de ingresso não encontrado' });
    }

    return tipo;
  }

  async create(userId: string, dto: CreateTicketType) {
    await this.assertOrganizador(dto.eventoId, userId);

    if (new Date(dto.fimVenda) <= new Date(dto.inicioVenda)) {
      throw new BadRequestError({
        message: 'A data de fim de venda deve ser posterior à data de início',
      });
    }

    const [criado] = await this.db
      .getInstance()
      .insert(tipoIngresso)
      .values({
        ...dto,
        quantidadeVendida: 0,
      })
      .returning();

    return criado;
  }

  async findAllByEvent(eventoId: string) {
    const [evento] = await this.db
      .getInstance()
      .select({ id: eventos.id })
      .from(eventos)
      .where(eq(eventos.id, eventoId))
      .limit(1);

    if (!evento) {
      throw new NotFoundError({ message: 'Evento não encontrado' });
    }

    return this.db
      .getInstance()
      .select()
      .from(tipoIngresso)
      .where(eq(tipoIngresso.eventoId, eventoId));
  }

  async findOne(id: string) {
    return this.findTipoOrThrow(id);
  }

  async update(userId: string, id: string, dto: UpdateTicketType) {
    const tipo = await this.findTipoOrThrow(id);

    await this.assertOrganizador(tipo.eventoId, userId);

    if (dto.fimVenda && dto.inicioVenda) {
      if (new Date(dto.fimVenda) <= new Date(dto.inicioVenda)) {
        throw new BadRequestError({
          message: 'A data de fim de venda deve ser posterior à data de início',
        });
      }
    }

    const [atualizado] = await this.db
      .getInstance()
      .update(tipoIngresso)
      .set(dto)
      .where(eq(tipoIngresso.id, id))
      .returning();

    return atualizado;
  }

  async delete(userId: string, id: string) {
    const tipo = await this.findTipoOrThrow(id);

    await this.assertOrganizador(tipo.eventoId, userId);

    if (tipo.quantidadeVendida > 0) {
      throw new BadRequestError({
        message:
          'Não é possível deletar um tipo de ingresso que já possui vendas',
      });
    }

    await this.db
      .getInstance()
      .delete(tipoIngresso)
      .where(eq(tipoIngresso.id, id));
  }
}
