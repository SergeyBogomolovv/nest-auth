import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserOptionsGuard } from 'src/auth/guards/user-options.guard';
import { UserResponse } from './responses/user.response';
import { RenameDto } from './dto/rename.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserId } from 'lib/decorators/user-id.decorator';

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
  @Get('one/:id')
  async findById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @ApiOperation({
    summary: 'Изменение имени',
    description:
      'Изменение имени, меняет имя только тому пользователю, у которого стоит токен',
  })
  @ApiResponse({ status: 200, type: UserResponse })
  @Put('rename')
  async renameUser(@UserId() id: string, @Body() body: RenameDto) {
    return this.userService.rename(id, body.name);
  }
  @ApiOperation({
    summary: 'Изменение аватарки',
    description:
      'Изменение аватарки, меняет аватарку только тому пользователю, у которого стоит токен',
  })
  @ApiResponse({ status: 200, type: UserResponse })
  @UseInterceptors(FileInterceptor('image'))
  @Put('update-image')
  async updateImage(
    @UserId() id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.changeImage(id, image);
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
