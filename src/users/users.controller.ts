import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/auth/guards/role.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  async getUsers(@Req() request: Request) {
    console.log(request.user);
    return this.userService.findMany();
  }
  @UseGuards(AdminGuard)
  @Get('test')
  async test(@Req() request: Request) {
    return { user: request.user };
  }
}
