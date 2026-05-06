import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller({ path: 'events' })
export class EventsController {
  @Get(':id')
  async findEventById() {}

  @Get('')
  async findAllEvents() {}

  @Post()
  async createEvent(@Body() body) {}
}
