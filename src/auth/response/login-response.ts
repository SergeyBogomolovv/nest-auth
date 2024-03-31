import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    example:
      'vskdgfdskuhfdhfiuhrjbejdeswhbfijbreugbDJKsfbndsfgbsdjhbgr3wjkdjkfnjHBF',
    description: 'accesToken',
  })
  accesToken: string;
}
