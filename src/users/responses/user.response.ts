import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: string;
  email: string;
  emailVerified: Date;
  createdAt: Date;
  role: $Enums.UserRole[];
  name: string;
  image: string;
  @Exclude()
  password: string;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  verifyLink: string;
  constructor(user: User) {
    Object.assign(this, user);
  }
}
