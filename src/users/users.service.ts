import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RenameDto } from './dto/rename.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findMany() {
    const users = await this.prisma.user.findMany();
    return users;
  }
  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }
  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }
  async create(dto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({ data: { ...dto } });
      return user;
    } catch (error) {
      throw new HttpException('Failed to create user', HttpStatus.BAD_GATEWAY);
    }
  }
  async rename(dto: RenameDto) {
    const user = await this.prisma.user.update({
      where: { id: dto.id },
      data: { name: dto.name },
    });
    return user;
  }
  async delete(id: string) {
    try {
      const user = await this.prisma.user.delete({ where: { id } });
      return user;
    } catch (error) {
      throw new HttpException('Failed to delete user', HttpStatus.BAD_GATEWAY);
    }
  }
}
