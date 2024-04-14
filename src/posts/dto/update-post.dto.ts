import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Title', description: 'title' })
  @IsString({ message: 'Title is string' })
  readonly title?: string;
  @ApiProperty({ example: 'Content', description: 'content' })
  @IsString({ message: 'Content is string' })
  readonly content?: string;
}
