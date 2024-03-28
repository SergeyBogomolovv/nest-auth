import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './utils/Guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return { msg: 'Logined' };
  }
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect() {
    return { msg: 'OK' };
  }
}
