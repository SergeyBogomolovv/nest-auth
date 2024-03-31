import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from 'src/users/responses/user.response';

export class LoginResponse {
  @ApiProperty({
    example: {
      id: 'jsdnfjkdsfndsn',
      email: 'example.gmail.com',
      image: 'https/yandexcloud/image/this.user',
      roles: ['ADMIN', 'USER'],
      createdAt: '2023-21-23',
      emailVerified: '2023-21-23',
      name: 'Gerax',
    },
    description: 'user',
  })
  user: UserResponse;
  @ApiProperty({
    example:
      'vskdgfdskuhfdhfiuhrjbejdeswhbfijbreugbDJKsfbndsfgbsdjhbgr3wjkdjkfnjHBF',
    description: 'accesToken',
  })
  accesToken: string;
}
