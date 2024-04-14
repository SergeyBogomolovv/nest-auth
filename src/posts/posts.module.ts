import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { options } from 'src/auth/config';
import { PostActionsGuard } from 'lib/guards/post-actions.guard';

@Module({
  imports: [UsersModule, JwtModule.registerAsync(options())],
  controllers: [PostsController],
  providers: [PostsService, PostActionsGuard],
})
export class PostsModule {}
