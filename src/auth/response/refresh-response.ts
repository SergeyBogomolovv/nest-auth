import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class RefreshResponse {
  @ApiProperty({
    example: 'dsjknfsDjkfjdsfgjdsfvnJNDFjnsdjfdsjfsdjfn',
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
