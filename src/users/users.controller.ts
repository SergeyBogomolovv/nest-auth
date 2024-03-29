import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  async getUsers(@Req() request: Request) {
    console.log(request.user);
    return this.userService.findMany();
  }
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
