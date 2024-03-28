import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { OAuthDto } from './dto/oauth-user-dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async validateUser(dto: OAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) return user;
    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        image: dto.image || '/noavatar.png',
      },
    });
    return newUser;
  }
}
