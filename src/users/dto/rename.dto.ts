import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RenameDto {
  @ApiProperty({ example: 'gerax', description: 'username' })
  @IsString({ message: 'Это поле должно быть строкой' })
  readonly name: string;
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: 'sdfjkdsfj-sdfsdf', description: 'userId' })
  readonly id: string;
}
