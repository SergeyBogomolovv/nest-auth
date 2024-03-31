import { IsPasswordsMatchingConstraint } from 'lib/decorators/is-passwords-matching-constraint.decorator';
import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'email',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'Gerax',
    description: 'username',
  })
  @IsString()
  name: string;
  @ApiProperty({
    example: '123456',
    description: 'password, min length 6',
  })
  @IsString()
  @MinLength(6)
  password: string;
  @ApiProperty({
    example: '123456',
    description: 'passwords should constraint',
  })
  @IsString()
  @MinLength(6)
  @Validate(IsPasswordsMatchingConstraint)
  passwordRepeat: string;
}
