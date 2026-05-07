import { Test, type TestingModule } from '@nestjs/testing';
import { TicketsController } from 'src/modules/ticket/ticket.controller';
import { TicketsService } from 'src/modules/ticket/ticket.service';

const sessionMock = { user: { id: '01900000-0000-7000-8000-000000000001' } };

const tipoMock = {
  id: '01900000-0000-7000-8000-000000000030',
  eventoId: '01900000-0000-7000-8000-000000000040',
  nome: 'Pista',
  preco: 5000,
  quantidadeTotal: 100,
  quantidadeVendida: 0,
  ativo: true,
  inicioVenda: new Date('2026-05-01').toISOString(),
  fimVenda: new Date('2026-06-01').toISOString(),
};

const serviceMock = {
  findAllByEvent: jest.fn().mockResolvedValue([tipoMock]),
  findOne: jest.fn().mockResolvedValue(tipoMock),
  create: jest.fn().mockResolvedValue(tipoMock),
  update: jest.fn().mockResolvedValue({ ...tipoMock, nome: 'VIP' }),
  delete: jest.fn().mockResolvedValue(undefined),
};

describe('TicketTypeController', () => {
  let controller: TicketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [{ provide: TicketsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
  });

  it('GET event/:eventoId — deve listar tipos de ingresso do evento', async () => {
    const result = await controller.findAllByEvent(tipoMock.eventoId);
    expect(Array.isArray(result)).toBe(true);
    expect(serviceMock.findAllByEvent).toHaveBeenCalledWith(tipoMock.eventoId);
  });

  it('GET :id — deve retornar um tipo de ingresso pelo id', async () => {
    const result = await controller.findById(tipoMock.id);
    expect(result.id).toBe(tipoMock.id);
    expect(serviceMock.findOne).toHaveBeenCalledWith(tipoMock.id);
  });

  it('POST / — deve criar um tipo de ingresso', async () => {
    const body = {
      eventoId: tipoMock.eventoId,
      nome: tipoMock.nome,
      preco: tipoMock.preco,
      quantidadeTotal: tipoMock.quantidadeTotal,
      ativo: tipoMock.ativo,
      inicioVenda: tipoMock.inicioVenda,
      fimVenda: tipoMock.fimVenda,
    };
    const result = await controller.create(sessionMock, body);
    expect(result.nome).toBe(tipoMock.nome);
    expect(serviceMock.create).toHaveBeenCalledWith(sessionMock.user.id, body);
  });

  it('PATCH :id — deve atualizar um tipo de ingresso', async () => {
    const result = await controller.update(sessionMock, tipoMock.id, {
      nome: 'VIP',
    });
    expect(result.nome).toBe('VIP');
    expect(serviceMock.update).toHaveBeenCalledWith(
      sessionMock.user.id,
      tipoMock.id,
      { nome: 'VIP' },
    );
  });

  it('DELETE :id — deve deletar um tipo de ingresso', async () => {
    await controller.delete(sessionMock, tipoMock.id);
    expect(serviceMock.delete).toHaveBeenCalledWith(
      sessionMock.user.id,
      tipoMock.id,
    );
  });
});
