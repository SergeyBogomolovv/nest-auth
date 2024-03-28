import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/GoogleGuard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor() {}
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return { msg: 'Logining' };
  }
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() request: Request) {
    return { user: request.user };
  }
}
