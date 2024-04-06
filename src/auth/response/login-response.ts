import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class LoginResponse {
  @ApiProperty({
    example:
      'vskdgfdskuhfdhfiuhrjbejdeswhbfijbreugbDJKsfbndsfgbsdjhbgr3wjkdjkfnjHBF',
    description: 'accesToken',
  })
  accesToken: string;
  @ApiProperty({
    example: {
      name: 'Gerax',
      email: 'email@email.com',
      image: 'http://image.com',
      otherInfo: 'other user info',
    },
    description: 'user Info',
  })
  user: User;
}
