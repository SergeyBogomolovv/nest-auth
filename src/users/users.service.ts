import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { Cache } from '@nestjs/cache-manager';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cacheManager: Cache,
  ) {}
  findMany(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  async findOneById(id: string): Promise<User> {
    const user = await this.cacheManager.get<User>(id);
    if (!user) {
      const dbUser = await this.prisma.user.findUnique({ where: { id } });
      if (!dbUser) return null;
      await this.cacheManager.set(id, dbUser);
      return dbUser;
    }
    return user;
  }
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.cacheManager.get<User>(email);
    if (!user) {
      const dbUser = await this.prisma.user.findUnique({ where: { email } });
      if (!dbUser) return null;
      await this.cacheManager.set(email, dbUser);
      return dbUser;
    }
    return user;
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
