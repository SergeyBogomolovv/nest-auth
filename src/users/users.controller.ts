import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  async getUsers() {
    return this.userService.findMany();
  }
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }
}
