import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import brycpt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findMany() {
    return await this.prisma.user.findMany();
  }
  async findOneById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
  async create(user: Partial<User>) {
    const hashedPassword = await this.hashPassword(user.password);
    return await this.prisma.user.create({
      data: { email: user.email, password: hashedPassword, name: user.name },
    });
  }
  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
  private async hashPassword(password: string) {
    return await brycpt.hash(password, 7);
  }
}
