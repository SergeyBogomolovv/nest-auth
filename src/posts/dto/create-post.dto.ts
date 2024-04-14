import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Title', description: 'title' })
  @IsString({ message: 'Title is required' })
  readonly title: string;
  @ApiProperty({ example: 'Content', description: 'content' })
  @IsString({ message: 'Content is required' })
  readonly content: string;
}
