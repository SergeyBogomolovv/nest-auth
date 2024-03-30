import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  findMany(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  findOneById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async create(user: Partial<User>): Promise<User> {
    const hashedPassword = this.hashPassword(user.password);
    return this.prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        verifyLink: user.verifyLink,
      },
    });
  }
  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    await this.prisma.token.deleteMany({ where: { userId: user.id } });
    return this.prisma.user.delete({ where: { id } });
  }
  private hashPassword(password: string) {
    return hashSync(password, 7);
  }
}
