import { $Enums, User } from '@prisma/client';

export class UserResponse {
  id: string;
  email: string;
  emailVerified: Date;
  createdAt: Date;
  roles: $Enums.UserRole[];
  name: string;
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
