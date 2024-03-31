import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';

export class UserResponse {
  @ApiProperty({ example: 'sdfiuhjenf-sdf2ef', description: 'userId' })
  id: string;
  @ApiProperty({ example: 'example@mail.com', description: 'email' })
  email: string;
  @ApiProperty({ example: 'null', description: 'date when email was verified' })
  emailVerified: Date;
  @ApiProperty({
    example: '2023-21-23',
    description: 'date when user was registered',
  })
  createdAt: Date;
  @ApiProperty({ example: ['ADMIN', 'USER'] })
  roles: $Enums.UserRole[];
  @ApiProperty({ example: 'Gerax' })
  name: string;
  @ApiProperty({ example: 'https/yandexcloud/image/this.user' })
  image: string;
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.emailVerified = user.emailVerified;
    this.createdAt = user.createdAt;
    this.roles = user.roles;
    this.name = user.name;
    this.image = user.image;
  }
}
