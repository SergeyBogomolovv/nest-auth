import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserId } from 'lib/decorators/user-id.decorator';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}
  @Get()
  async test(@UserId() userId: string) {
    return userId;
  }
}
