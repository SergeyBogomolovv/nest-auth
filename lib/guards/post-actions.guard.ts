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
@Injectable()
export class PostActionsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      if (!token) throw new UnauthorizedException();
      const user: User = this.jwtService.verify(token);
      if (user.id !== request.params.id && !user.roles.includes('ADMIN'))
        throw new UnauthorizedException();
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
