import {
  Controller,
  Get,
  UseGuards,
  Req,
  Redirect,
  Post,
  Body,
} from '@nestjs/common';
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
  @Redirect('http//localhost:3000', 302)
  async googleRedirect(@Req() request: Request) {
    return request.user;
  }
  @Post('login')
  async login(@Body() dto: string) {}
}
