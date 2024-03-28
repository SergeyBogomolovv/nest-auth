import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'gerax', description: 'username' })
  @IsString({ message: 'Это поле должно быть строкой' })
  readonly name: string;
  @ApiProperty({ example: 'user@mail.ru', description: 'email' })
  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is required' })
  readonly email: string;
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 12, { message: 'Не менее 4х и не более 12 символов' })
  @ApiProperty({ example: '12345', description: 'password' })
  readonly password: string;
}
