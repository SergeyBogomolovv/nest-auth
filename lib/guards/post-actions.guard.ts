import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PostsService } from 'src/posts/posts.service';
@Injectable()
export class PostActionsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private postService: PostsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      if (!token) throw new UnauthorizedException();
      const user: User = this.jwtService.verify(token);
      const post = await this.postService.getOne(request.params.id);
      if (user.id !== post.authorId && !user.roles.includes('ADMIN'))
        throw new UnauthorizedException();
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
