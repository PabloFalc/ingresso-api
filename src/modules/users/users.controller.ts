import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import type { UsersQuery } from './schemas/users-queryschema';
import type { UserUpdate } from './dto/uses.dto';
import { Documented } from 'src/core/decorators/documented/route-doc.decorator';
import {
  findAllUsers,
  findUserById,
  updateUserById,
} from './schemas/users.docs';

@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Documented(findUserById)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Documented(findAllUsers)
  @Get()
  async findAll(@Query() query: UsersQuery) {
    return await this.service.findAll(query);
  }

  @Documented(updateUserById)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UserUpdate) {
    return await this.service.updateUser(body, id);
  }
}
