import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserOptionsGuard } from 'src/auth/guards/user-options.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
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
