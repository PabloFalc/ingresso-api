import { Test, type TestingModule } from '@nestjs/testing';
import { OrdersController } from '../../../modules/order/order.controller';
import { OrdersService } from '../../../modules/order/order.service';

const sessionMock = { user: { id: '01900000-0000-7000-8000-000000000001' } };

const pedidoMock = {
  id: '01900000-0000-7000-8000-000000000010',
  userId: sessionMock.user.id,
  quantidadeTotal: 2,
  status: 'PENDENTE',
  criadoEm: new Date().toISOString(),
  atualizadoEm: new Date().toISOString(),
};

const serviceMock = {
  findAll: jest.fn().mockResolvedValue([pedidoMock]),
  findOne: jest.fn().mockResolvedValue(pedidoMock),
  create: jest.fn().mockResolvedValue(pedidoMock),
  pay: jest.fn().mockResolvedValue({ ...pedidoMock, status: 'PAGO' }),
  cancel: jest.fn().mockResolvedValue({ ...pedidoMock, status: 'CANCELADO' }),
};

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: serviceMock }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('GET /orders — deve listar pedidos do usuário autenticado', async () => {
    const result = await controller.findAllOrders(sessionMock);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].userId).toBe(sessionMock.user.id);
    expect(serviceMock.findAll).toHaveBeenCalledWith(sessionMock.user.id);
  });

  it('GET /orders/:id — deve retornar um pedido do usuário', async () => {
    const result = await controller.findOrderById(sessionMock, pedidoMock.id);
    expect(result.id).toBe(pedidoMock.id);
    expect(serviceMock.findOne).toHaveBeenCalledWith(
      sessionMock.user.id,
      pedidoMock.id,
    );
  });

  it('POST /orders — deve criar um pedido', async () => {
    const body = {
      itens: [
        {
          tipoIngressoId: '01900000-0000-7000-8000-000000000020',
          quantidade: 2,
        },
      ],
    };
    const result = await controller.createOrder(sessionMock, body);
    expect(result.status).toBe('PENDENTE');
    expect(serviceMock.create).toHaveBeenCalledWith(sessionMock.user.id, body);
  });

  it('POST /orders/:id/pay — deve pagar o pedido', async () => {
    const result = await controller.payOrder(sessionMock, pedidoMock.id);
    expect(result.status).toBe('PAGO');
    expect(serviceMock.pay).toHaveBeenCalledWith(
      sessionMock.user.id,
      pedidoMock.id,
    );
  });

  it('DELETE /orders/:id — deve cancelar o pedido', async () => {
    const result = await controller.cancelOrder(sessionMock, pedidoMock.id);
    expect(result.status).toBe('CANCELADO');
    expect(serviceMock.cancel).toHaveBeenCalledWith(
      sessionMock.user.id,
      pedidoMock.id,
    );
  });
});
