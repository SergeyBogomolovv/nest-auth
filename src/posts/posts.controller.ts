import { Controller, Get, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserId } from 'lib/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async test(@UserId() userId: string) {
    return userId;
  }
}
