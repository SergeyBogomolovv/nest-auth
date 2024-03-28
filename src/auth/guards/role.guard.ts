import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const reqUser = request.user;
    if (!reqUser) throw new HttpException('No auth', HttpStatus.UNAUTHORIZED);
    const dbUser = await this.prisma.user.findUnique({
      where: { id: reqUser.id },
    });
    if (dbUser.role === 'ADMIN') {
      return true;
    } else {
      throw new HttpException('No acces', HttpStatus.UNAUTHORIZED);
    }
  }
}
