import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Tokens } from './interfaces';
import { Response, Request, response } from 'express';
import { Cookie } from '@common/common/decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() response: Response) {
    const tokens = await this.authService.login(dto);
    if (!tokens) {
      throw new BadRequestException('Unable to login');
    }
    this.setRefreshTokenToCookie(tokens, response);
  }

  @Post('registration')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.registration(dto);
    if (!user) {
      throw new BadRequestException('Unable to register user');
    }
    return { succes: true };
  }

  @Get('refresh')
  async refreshTokens(@Cookie('refreshToken') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();
    const token = await this.authService.refresh(refreshToken);
    if (!token) {
      throw new BadRequestException('Unable to refresh');
    }
    return { accesToken: token };
  }
  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies['refreshToken'];
    await this.authService.logout(token);
    response.clearCookie('refreshToken');
    response.status(HttpStatus.CREATED);
  }
  private setRefreshTokenToCookie(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }
    res.cookie('refreshToken', tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure: false,
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ accesToken: tokens.accesToken });
  }
}
