import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { Cache } from '@nestjs/cache-manager';
import { UserResponse } from './responses/user.response';
import { FilesService } from 'src/files/files.service';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cacheManager: Cache,
    private yandex: FilesService,
  ) {}
  async findMany(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserResponse(user));
  }
  async findOneById(id: string, isReset = false): Promise<User> {
    if (isReset) {
      await this.cacheManager.del(id);
    }
    const user = await this.cacheManager.get<User>(id);
    if (!user) {
      const dbUser = await this.prisma.user.findUnique({ where: { id } });
      if (!dbUser) return null;
      await this.cacheManager.set(id, dbUser);
      return dbUser;
    }
    return user;
  }
  async findOneByEmail(email: string, isReset = false): Promise<User> {
    if (isReset) {
      await this.cacheManager.del(email);
    }
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
  async rename(id: string, name: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User doesn`t exists');
    this.prisma.user.update({ where: { id }, data: { name } });
    return this.prisma.user.update({ where: { id }, data: { name } });
  }
  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    await this.prisma.token.deleteMany({ where: { userId: user.id } });
    await Promise.all([
      this.cacheManager.del(id),
      this.cacheManager.del(user.email),
    ]);
    return this.prisma.user.delete({ where: { id } });
  }
  private hashPassword(password: string) {
    return hashSync(password, 7);
  }
}
