import { Test, type TestingModule } from '@nestjs/testing';
import { type Event } from 'src/modules/event/dtos/events.dto';
import { EventsController } from 'src/modules/event/events.controller';
import { EventsService } from 'src/modules/event/events.service';

const sessionMock = { user: { id: '01900000-0000-7000-8000-000000000001' } };

const eventMock: { organizadorId: string } & Omit<Event, 'organizador'> = {
  id: '01900000-0000-7000-8000-000000000010',
  titulo: 'Show de Rock',
  descricao: 'Um show incrível',
  dataInicio: '2026-06-01T20:00:00.000Z',
  dataFim: '2026-06-01T23:00:00.000Z',
  status: 'RASCUNHO',
  local: 'Arena Fortaleza',
  organizadorId: sessionMock.user.id,
};

const serviceMock = {
  findById: jest.fn().mockResolvedValue(eventMock),
  getAllEvents: jest.fn().mockResolvedValue([eventMock]),
  create: jest.fn().mockResolvedValue(eventMock),
  updateEventById: jest
    .fn()
    .mockResolvedValue({ ...eventMock, titulo: 'Novo Título' }),
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
    expect(result.id).toBe(eventMock.id);
    expect(serviceMock.findById).toHaveBeenCalledWith(eventMock.id);
  });

  it('GET / — deve retornar lista de eventos', async () => {
    const result = await controller.findAllEvents(undefined);
    expect(Array.isArray(result)).toBe(true);
  });

  it('POST / — deve criar um evento passando a sessão do usuário', async () => {
    const body = {
      titulo: eventMock.titulo,
      descricao: eventMock.descricao,
      dataInicio: eventMock.dataInicio,
      dataFim: eventMock.dataFim,
      status: eventMock.status,
      local: eventMock.local,
    };

    const result = (await controller.createEvent(
      sessionMock,
      body,
    )) as typeof eventMock;
    expect(result.organizadorId).toBe(sessionMock.user.id);
    expect(serviceMock.create).toHaveBeenCalledWith(body, sessionMock.user.id);
  });

  it('PATCH :id — deve atualizar um evento', async () => {
    const result = (await controller.updateEventById(
      { id: eventMock.id },
      { titulo: 'Novo Título' },
    )) as typeof eventMock;
    expect(result.titulo).toBe('Novo Título');
    expect(serviceMock.updateEventById).toHaveBeenCalledWith(eventMock.id, {
      titulo: 'Novo Título',
    });
  });

  it('DELETE :id — deve deletar e retornar null', async () => {
    const result = await controller.deleteEventById(eventMock.id);
    expect(result).toBeNull();
  });

  it('GET :id/ingressos — deve retornar ingressos do evento', async () => {
    const result = await controller.findIngressosByEventId(eventMock.id);
    expect(Array.isArray(result)).toBe(true);
  });
});
