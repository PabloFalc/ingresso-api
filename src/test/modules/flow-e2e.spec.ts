import { Test, type TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { db } from 'src/infra/database/drizzle-client';
import { users, sessions, accounts } from 'src/infra/database/schemas';
import { tipoIngresso } from 'src/infra/database/schemas/ticket-order.table';
import { pedidos } from 'src/infra/database/schemas/order.table';
import { pedidoItens } from 'src/infra/database/schemas/order-items.table';
import { eventos } from 'src/infra/database/schemas/event.table';
import { eq } from 'drizzle-orm';
import type { AuthOutType, SignUp } from 'src/modules/auth/dto/auth.schema';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import type { Orders } from 'src/modules/order/dtos/order.dto';
import type { Event } from 'src/modules/event/dtos/events.dto';
import type { TicketType } from 'src/modules/ticket/dtos/ticket-type.schema';

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

    for (const tipo of tipos) {
      const pedidosComTipo = await db
        .select({ pedidoId: pedidoItens.pedidoId })
        .from(pedidoItens)
        .where(eq(pedidoItens.tipoIngressoId, tipo.id));

      for (const { pedidoId } of pedidosComTipo) {
        await db.delete(pedidoItens).where(eq(pedidoItens.pedidoId, pedidoId));
        await db.delete(pedidos).where(eq(pedidos.id, pedidoId));
      }

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
  let tipoId1: string;
  let tipoId2: string;
  let pedidoId1: string;
  let pedidoId2: string;
  let agent: ReturnType<typeof request.agent>;

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
    const res = await agent
      .post('/events')
      .send({
        titulo: 'Festival E2E',
        descricao: 'Evento criado pelo teste e2e',
        dataInicio: '2026-08-01T20:00:00.000Z',
        dataFim: '2026-08-01T23:59:00.000Z',
        status: 'ativo',
        local: 'Arena Fortaleza',
      })
      .expect(201);
    const body = res.body as Event;

    eventoId = body.id;

    expect(eventoId).toBeDefined();
  });

  // ! Criar os tipos de ingresso

  it('4. deve criar o tipo de ingresso 1 (Pista)', async () => {
    const res = await agent
      .post('/tickets')
      .send({
        eventoId,
        nome: 'Pista',
        preco: 5000,
        quantidadeTotal: 100,
        ativo: true,
        inicioVenda: '2026-06-01T00:00:00.000Z',
        fimVenda: '2026-07-31T23:59:00.000Z',
      })
      .expect(201);

    const body = res.body as TicketType;
    tipoId1 = body.id;

    expect(tipoId1).toBeDefined();
  });

  it('5. deve criar o tipo de ingresso 2 (VIP)', async () => {
    const res = await agent
      .post('/tickets')
      .send({
        eventoId,
        nome: 'VIP',
        preco: 15000,
        quantidadeTotal: 20,
        ativo: true,
        inicioVenda: '2026-06-01T00:00:00.000Z',
        fimVenda: '2026-07-31T23:59:00.000Z',
      })
      .expect(201);

    const body = res.body as TicketType;
    tipoId2 = body.id;
    expect(tipoId2).toBeDefined();
  });

  // ! Criar pedidos

  it('6. deve criar pedido com ingresso Pista', async () => {
    const res = await agent
      .post('/orders')
      .send({ itens: [{ tipoIngressoId: tipoId1, quantidade: 2 }] })
      .expect(201);

    const body = res.body as Orders;
    pedidoId1 = body.id;

    expect(pedidoId1).toBeDefined();
    expect(body.status).toBe('PENDENTE');
  });

  it('7. deve criar pedido com ingresso VIP', async () => {
    const res = await agent
      .post('/orders')
      .send({ itens: [{ tipoIngressoId: tipoId2, quantidade: 1 }] })
      .expect(201);

    const body = res.body as Orders;
    pedidoId2 = body.id;

    expect(pedidoId2).toBeDefined();
    expect(body.status).toBe('PENDENTE');
  });

  // ! 5. Pagar os dois pedidos

  it('8. deve pagar o pedido Pista', async () => {
    const res = await agent.post(`/orders/${pedidoId1}/pay`).expect(200);

    const body = res.body as Orders;

    expect(body.status).toBe('PAGO');
  });

  it('9. deve pagar o pedido VIP', async () => {
    const res = await agent.post(`/orders/${pedidoId2}/pay`).expect(200);
    const body = res.body as Orders;
    expect(body.status).toBe('PAGO');
  });
});
