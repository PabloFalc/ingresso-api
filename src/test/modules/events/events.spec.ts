/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, type TestingModule } from '@nestjs/testing';
import { EventsController } from 'src/modules/event/events.controller';
import { EventsService } from 'src/modules/event/events.service';

const eventMock = {
  id: '01900000-0000-7000-8000-000000000001',
  titulo: 'Show de Rock',
  descricao: 'Um show incrível',
  dataInicio: '2026-06-01T20:00:00.000Z',
  dataFim: '2026-06-01T23:00:00.000Z',
  status: 'ativo',
  local: 'Arena Fortaleza',
  organizador: {
    id: '01900000-0000-7000-8000-000000000002',
    name: 'Organizador Teste',
    email: 'org@teste.com',
    cpf: '111.222.333-44',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const serviceMock = {
  findById: jest.fn().mockResolvedValue(eventMock),
  getAllEvents: jest.fn().mockResolvedValue([eventMock]),
  create: jest.fn().mockResolvedValue({
    ...eventMock,
    organizadorId: eventMock.organizador.id,
  }),
  updateEventById: jest.fn().mockResolvedValue(eventMock),
  deleteEventById: jest.fn().mockResolvedValue(null),
  findIngressosByEventId: jest.fn().mockResolvedValue([]),
};

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('GET :id — deve retornar um evento pelo id', async () => {
    const result = await controller.findEventById(eventMock.id);
    expect(result).toMatchObject({
      id: eventMock.id,
      titulo: eventMock.titulo,
    });
    expect(serviceMock.findById).toHaveBeenCalledWith(eventMock.id);
  });

  it('GET / — deve retornar lista de eventos', async () => {
    const result = await controller.findAllEvents(undefined);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].titulo).toBe(eventMock.titulo);
  });

  it('POST / — deve criar um evento', async () => {
    const payload = {
      titulo: eventMock.titulo,
      descricao: eventMock.descricao,
      dataInicio: eventMock.dataInicio,
      dataFim: eventMock.dataFim,
      status: eventMock.status as any,
      local: eventMock.local,
      organizadorId: eventMock.organizador.id,
    };

    const result = await controller.createEvent(payload);
    expect(result).toHaveProperty('id');
    expect(serviceMock.create).toHaveBeenCalledWith(payload);
  });

  it('PATCH :id — deve atualizar um evento', async () => {
    const result = await controller.updateEventById(
      { id: eventMock.id },
      { titulo: 'Novo Título' },
    );
    expect(result).toMatchObject({ id: eventMock.id });
    expect(serviceMock.updateEventById).toHaveBeenCalledWith(eventMock.id, {
      titulo: 'Novo Título',
    });
  });

  it('DELETE :id — deve deletar um evento e retornar null', async () => {
    const result = await controller.deleteEventById(eventMock.id);
    expect(result).toBeNull();
    expect(serviceMock.deleteEventById).toHaveBeenCalledWith(eventMock.id);
  });

  it('GET :id/ingressos — deve retornar ingressos do evento', async () => {
    const result = await controller.findIngressosByEventId(eventMock.id);
    expect(Array.isArray(result)).toBe(true);
    expect(serviceMock.findIngressosByEventId).toHaveBeenCalledWith(
      eventMock.id,
    );
  });
});
