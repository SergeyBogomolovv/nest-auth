import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { User } from 'prisma/prisma-client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {
    super();
  }
  serializeUser(user: User, done: Function) {
    done(null, user);
  }
  async deserializeUser(payload: any, done: Function) {
    const user = await this.userService.findOneById(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
