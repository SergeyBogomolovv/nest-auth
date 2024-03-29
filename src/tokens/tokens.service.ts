import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { add } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import * as uuid from 'uuid';
@Injectable()
export class TokensService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  generateRefreshToken(userId: string): Promise<Token> {
    return this.prisma.token.create({
      data: { token: uuid.v4(), exp: add(new Date(), { months: 1 }), userId },
    });
  }
  getRefreshToken(token: string): Promise<Token> {
    return this.prisma.token.findFirst({ where: { token } });
  }
  async deleteRefreshToken(token: string): Promise<Token> {
    return this.prisma.token.delete({ where: { token } });
  }
  generateAccesToken(user: User) {
    return (
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.role,
      })
    );
  }
}
