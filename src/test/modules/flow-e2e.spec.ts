import { Test, type TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { db } from 'src/infra/database/drizzle-client';
import {
  users,
  sessions,
  accounts,
  ingressos,
} from 'src/infra/database/schemas';
import { tipoIngresso } from 'src/infra/database/schemas/ticket-order.table';
import { pedidos } from 'src/infra/database/schemas/order.table';
import { pedidoItens } from 'src/infra/database/schemas/order-items.table';
import { eventos } from 'src/infra/database/schemas/event.table';
import { eq } from 'drizzle-orm';
import type { AuthOutType, SignUp } from 'src/modules/auth/dto/auth.schema';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import type { Orders } from 'src/modules/order/dtos/order.dto';
import type { CreateEvent, Event } from 'src/modules/event/dtos/events.dto';
import type {
  CreateTicketType,
  TicketType,
} from 'src/modules/ticket/dtos/ticket-type.schema';
import { createEventPeriod } from './helpers/now-period';
import type { Redis } from 'ioredis';
import { REDIS } from 'src/infra/cache/redis.client';

const testUser: SignUp = {
  name: 'Organizador E2E',
  email: 'e2e-flow@jest.com',
  cpf: '999.888.777-66',
  password: 'senha1234',
};

async function cleanup(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) return;

  const eventosDoUser = await db
    .select({ id: eventos.id })
    .from(eventos)
    .where(eq(eventos.organizadorId, user.id));

  for (const evento of eventosDoUser) {
    const tipos = await db
      .select({ id: tipoIngresso.id })
      .from(tipoIngresso)
      .where(eq(tipoIngresso.eventoId, evento.id));

    const pedidosIds = new Set<string>();

    for (const tipo of tipos) {
      const pedidosComTipo = await db
        .select({ pedidoId: pedidoItens.pedidoId })
        .from(pedidoItens)
        .where(eq(pedidoItens.tipoIngressoId, tipo.id));

      for (const { pedidoId } of pedidosComTipo) {
        pedidosIds.add(pedidoId);
      }
    }

    for (const pedidoId of pedidosIds) {
      await db.delete(ingressos).where(eq(ingressos.pedidoId, pedidoId));

      await db.delete(pedidoItens).where(eq(pedidoItens.pedidoId, pedidoId));

      await db.delete(pedidos).where(eq(pedidos.id, pedidoId));
    }

    for (const tipo of tipos) {
      await db.delete(tipoIngresso).where(eq(tipoIngresso.id, tipo.id));
    }

    await db.delete(eventos).where(eq(eventos.id, evento.id));
  }

  await db.delete(accounts).where(eq(accounts.userId, user.id));

  await db.delete(sessions).where(eq(sessions.userId, user.id));

  await db.delete(users).where(eq(users.id, user.id));
}

describe('Fluxo E2E — Login → Evento → Tickets → Pedido → Pagamento', () => {
  let app: NestFastifyApplication;
  let eventoId: string;
  let ticketOrderId1: string;
  let ticketOrderId2: string;
  let pedidoId: string;
  let agent: ReturnType<typeof request.agent>;
  const period = createEventPeriod();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    agent = request.agent(app.getHttpServer());

    await cleanup(testUser.email);
  });

  afterAll(async () => {
    await cleanup(testUser.email);
    await app.close();

    const redis = app.get<Redis>(REDIS);

    await redis.quit();
    await db.$client.end();
  });

  // ! Cadastrar e login

  it('1. deve cadastrar o usuário organizador', async () => {
    const res = await agent
      .post('/api/auth/sign-up/email')
      .send(testUser)
      .expect(200);

    const body = res.body as AuthOutType;

    expect(body.user.email).toBe(testUser.email);
  });

  it('2. deve logar e receber token', async () => {
    const res = await agent
      .post('/api/auth/sign-in/email')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    const token = res.body as AuthOutType;

    expect(token.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  // ! Criar evento

  it('3. deve criar um evento', async () => {
    const event: CreateEvent = {
      titulo: 'Festival E2E',
      descricao: 'Evento criado pelo teste e2e',
      dataInicio: period.dataInicioEvento,
      dataFim: period.dataFimEvento,
      status: 'PUBLICADO',
      local: 'Arena Fortaleza',
    };

    const res = await agent.post('/events').send(event).expect(201);
    const body = res.body as Event;

    eventoId = body.id;

    expect(eventoId).toBeDefined();
  });

  // ! Criar os tipos de ingresso

  it('4. deve criar o tipo de ingresso 1 (Pista)', async () => {
    const ticketType: CreateTicketType = {
      eventoId,
      nome: 'Pista',
      preco: 5000,
      quantidadeTotal: 100,
      ativo: true,
      inicioVenda: period.inicioVenda,
      fimVenda: period.fimVenda,
    };

    const res = await agent.post('/tickets').send(ticketType).expect(201);

    const body = res.body as TicketType;
    ticketOrderId1 = body.id;

    expect(ticketOrderId1).toBeDefined();
  });

  it('5. deve criar o tipo de ingresso 2 (VIP)', async () => {
    const ticketType: CreateTicketType = {
      eventoId,
      nome: 'VIP',
      preco: 15000,
      quantidadeTotal: 20,
      ativo: true,
      inicioVenda: period.inicioVenda,
      fimVenda: period.fimVenda,
    };

    const res = await agent.post('/tickets').send(ticketType).expect(201);

    const body = res.body as TicketType;

    ticketOrderId2 = body.id;
    expect(ticketOrderId2).toBeDefined();
  });

  // ! Criar pedidos

  it('6. deve criar pedido os dois tipos de ingresso', async () => {
    const res = await agent.post('/orders').send({
      itens: [
        { tipoIngressoId: ticketOrderId1, quantidade: 2 },
        { tipoIngressoId: ticketOrderId2, quantidade: 1 },
      ],
    });

    const body = res.body as Orders;
    pedidoId = body.id;

    expect(pedidoId).toBeDefined();
    expect(body.status).toBe('PENDENTE');
  });

  // ! 5. Pagar os dois pedidos

  it('7. deve realizar o pagamento do pedido', async () => {
    const res = await agent.post(`/orders/${pedidoId}/pay`).expect(200);
    const body = res.body as Orders;

    expect(body.status).toBe('PAGO');
  });
});
