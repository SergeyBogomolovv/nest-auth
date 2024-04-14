import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export const UserId = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const user: User = jwt.decode(token) as User;
    return user.id;
  },
);
