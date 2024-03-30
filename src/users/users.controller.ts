import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AccesToken } from 'lib/decorators/acces-token.decorator';
import { UserOptionsGuard } from 'lib/guards/user-options.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Req() request: Request) {
    console.log(request.user);
    return this.userService.findMany();
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }
  @UseGuards(UserOptionsGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
