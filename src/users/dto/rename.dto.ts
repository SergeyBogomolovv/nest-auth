import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RenameDto {
  @ApiProperty({ example: 'gerax', description: 'username' })
  @IsString({ message: 'Name is required' })
  readonly name: string;
}
