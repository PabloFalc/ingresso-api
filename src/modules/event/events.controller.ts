import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import type { EventQuery } from './schemas/events-query.schema';
import type { CreateEvent, UpdateEvent } from './dtos/events.dto';
import { Documented } from 'src/core/decorators/documented/route-doc.decorator';
import {
  createEvent,
  deleteEvent,
  findAllEvents,
  findEventById,
  findIngressosByEventId,
  updateEventDoc,
} from './schemas/event-doc.schema';

@Controller({ path: 'events' })
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Documented(findEventById)
  @Get(':id')
  async findEventById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Documented(findAllEvents)
  @Get('')
  async findAllEvents(@Query() query: EventQuery) {
    return await this.service.getAllEvents(query);
  }

  @Documented(createEvent)
  @Post('')
  async createEvent(@Body() body: CreateEvent) {
    return this.service.create(body);
  }

  @Documented(updateEventDoc)
  @Patch(':id')
  async updateEventById(
    @Param() param: { id: string },
    @Body() body: UpdateEvent,
  ) {
    return this.service.updateEventById(param.id, body);
  }

  @Documented(deleteEvent)
  @Delete(':id')
  async deleteEventById(@Param('id') id: string) {
    return this.service.deleteEventById(id);
  }

  @Documented(findIngressosByEventId)
  @Get(':id/ingressos')
  async findIngressosByEventId(@Param('id') id: string) {
    return this.service.findIngressosByEventId(id);
  }
}
