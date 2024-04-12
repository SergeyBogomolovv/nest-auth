import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserId } from 'lib/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationParams } from './dto/pagination-params';
import { CreatePostDto } from './dto/create-post.dto';
import { PostActionsGuard } from 'lib/guards/post-actions.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostResponse } from './responses/post-response';
@ApiTags('Посты')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}
  @ApiOperation({
    summary: 'Получение постов',
    description: 'Получение постов в зависимости от страницы и лимита',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: 200, type: [PostResponse] })
  @Get()
  async getMany(@Query() params: PaginationParams) {
    return this.postService.getMany(params);
  }
  @ApiOperation({
    summary: 'Получение одного поста',
    description: 'Получение поста по ид',
  })
  @ApiResponse({ status: 200, type: PostResponse })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.postService.getOne(id);
  }
  @ApiOperation({
    summary: 'Создание поста',
    description: 'Пост создать может только авторизованный пользователь',
  })
  @ApiResponse({ status: 200, type: PostResponse })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@UserId() userId: string, @Body() body: CreatePostDto) {
    return this.postService.create(body, userId);
  }
  @ApiOperation({
    summary: 'Обновление поста',
    description: 'Пост обновить может только владелец',
  })
  @ApiResponse({ status: 200, type: PostResponse })
  @UseGuards(PostActionsGuard)
  @Put(':id')
  async update(@Param('id') postId: string, @Body() body: UpdatePostDto) {
    return this.postService.update(body, postId);
  }
  @ApiOperation({
    summary: 'Удаление поста',
    description: 'Пост удалить может только владелец или админ',
  })
  @ApiResponse({ status: 200, type: PostResponse })
  @UseGuards(PostActionsGuard)
  @Delete(':id')
  async delete(@Param('id') postId: string) {
    return this.postService.delete(postId);
  }
}
