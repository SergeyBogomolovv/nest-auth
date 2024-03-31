import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserOptionsGuard } from 'src/auth/guards/user-options.guard';
import { UserResponse } from './responses/user.response';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @ApiOperation({
    summary: 'Получение пользователей',
    description:
      'Получение всех пользователей, стоит гуард на наличие jwt токена',
  })
  @ApiResponse({ status: 200, type: [UserResponse] })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    return this.userService.findMany();
  }
  @ApiOperation({
    summary: 'Получение пользователя',
    description: 'Получение одного пользователя по ид',
  })
  @ApiResponse({ status: 200, type: UserResponse })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @ApiOperation({
    summary: 'Удаление пользователя пользователя',
    description:
      'Удаление пользователя по ид, стоит гуард, который проверяет наличие роли админ или соответствие ид пользователя из токена на ид удаляемого пользователя. Так же удаляет токены этого пользователя',
  })
  @ApiResponse({ status: 200, type: UserResponse })
  @UseGuards(UserOptionsGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
