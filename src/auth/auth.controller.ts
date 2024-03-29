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
  Param,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Tokens } from './interfaces';
import { Response, Request } from 'express';
import { Cookie } from '@common/common/decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() response: Response) {
    const data = await this.authService.login(dto);
    if (!data) {
      throw new BadRequestException('Unable to login');
    }
    response.cookie('refreshToken', data.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(data.refreshToken.exp),
      secure: false,
      path: '/',
    });
    response
      .status(HttpStatus.CREATED)
      .json({ accesToken: data.accesToken, user: data.user });
  }

  @Post('registration')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.registration(dto);
    if (!user) {
      throw new BadRequestException('Unable to register user');
    }
    return { message: 'Confirmation email sent!' };
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

  @Get('verify-email/:token')
  async verify(@Param('token') token: string, @Res() res: Response) {
    this.authService.verifyEmail(token);
    res.redirect(`${process.env.EMAIL_VERIFY_REDIRECT_URL}`);
  }

  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies['refreshToken'];
    await this.authService.logout(token);
    response.clearCookie('refreshToken');
    response.status(HttpStatus.CREATED);
  }
}
