import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class PostResponse {
  @ApiProperty({ example: 'sdfiuhjenf-sdf2ef', description: 'userId' })
  id: string;
  @ApiProperty({ example: 'Title', description: 'title' })
  title: string;
  @ApiProperty({ example: 'content', description: 'content' })
  content: string;
  @ApiProperty({
    example: '2023-21-23',
    description: 'date when post was created',
  })
  createdAt: Date;
  @ApiProperty({
    example: {
      name: 'gerax',
      email: 'email@gmail.com',
      other: 'Other user Info',
    },
  })
  author: User;
  @ApiProperty({ example: 'sdfiuhjenf-sdf2efdsf' })
  authorId: string;
}
