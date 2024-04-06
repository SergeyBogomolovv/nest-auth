import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserOptionsGuard } from 'src/auth/guards/user-options.guard';
import { UserResponse } from './responses/user.response';
import { RenameDto } from './dto/rename.dto';

@ApiTags('Пользователи')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @ApiOperation({
    summary: 'Получение пользователей',
    description:
      'Получение всех пользователей, стоит гуард на наличие jwt токена',
  })
  @ApiResponse({ status: 200, type: [UserResponse] })
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
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @ApiOperation({
    summary: 'Изменение имени',
    description:
      'Изменение имени, стоит гуард, который проверяет наличие роли админ или соответствие ид пользователя из токена',
  })
  @ApiResponse({ status: 200, type: UserResponse })
  @UseGuards(UserOptionsGuard)
  @Put('rename/:id')
  async renameUser(@Param('id') id: string, @Body() body: RenameDto) {
    return this.userService.rename(id, body.name);
  }

  @ApiOperation({
    summary: 'Удаление пользователя',
    description:
      'Удаление пользователя по ид, стоит гуард, который проверяет наличие роли админ или соответствие ид пользователя из токена на ид удаляемого пользователя. Так же удаляет токены этого пользователя',
  })
  @ApiResponse({ status: 200, type: UserResponse })
  @UseGuards(UserOptionsGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
