import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AccesToken = createParamDecorator(
  (key: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.authorization.split(' ')[1];
  },
);
