import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationParams } from './dto/pagination-params';

@Injectable()
export class PostsService {
  constructor(
    private userService: UsersService,
    private prisma: PrismaService,
  ) {}
  async getMany(params: PaginationParams) {
    return this.prisma.post.findMany({
      include: { author: true },
      skip: params.limit * params.page - params.limit,
      take: params.limit,
    });
  }
  async getOne(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }
  async create(dto: CreatePostDto, userId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new BadRequestException('User doesnot exists');
    return this.prisma.post.create({
      data: { title: dto.title, content: dto.content, authorId: user.id },
    });
  }
  async update(dto: UpdatePostDto, postId: string) {
    return this.prisma.post.update({
      where: { id: postId },
      data: { title: dto.title, content: dto.content },
    });
  }
  async delete(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
