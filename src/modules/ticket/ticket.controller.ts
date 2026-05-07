import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import { TicketsService } from './ticket.service';
import type {
  CreateTicketType,
  UpdateTicketType,
} from './dtos/ticket-type.schema';
import { Documented } from 'src/core/decorators/documented/route-doc.decorator';
import {
  createTicketTypeDoc,
  deleteTicketTypeDoc,
  findAllTicketTypesByEventDoc,
  findTicketTypeByIdDoc,
  updateTicketTypeDoc,
} from './schemas/tickets-doc.schema';

@Controller({ path: 'tickets' })
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Documented(findAllTicketTypesByEventDoc)
  @Get('event/:eventoId')
  async findAllByEvent(@Param('eventoId') eventoId: string) {
    return this.service.findAllByEvent(eventoId);
  }

  @Documented(findTicketTypeByIdDoc)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Documented(createTicketTypeDoc)
  @Post('')
  async create(
    @Session() session: { user: { id: string } },
    @Body() body: CreateTicketType,
  ) {
    return this.service.create(session.user.id, body);
  }

  @Documented(updateTicketTypeDoc)
  @Patch(':id')
  async update(
    @Session() session: { user: { id: string } },
    @Param('id') id: string,
    @Body() body: UpdateTicketType,
  ) {
    return this.service.update(session.user.id, id, body);
  }

  @Documented(deleteTicketTypeDoc)
  @Delete(':id')
  async delete(
    @Session() session: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.service.delete(session.user.id, id);
  }
}
