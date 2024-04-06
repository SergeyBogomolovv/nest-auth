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
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { Cookie } from 'lib/decorators/cookies.decorator';
import { GoogleAuthGuard } from './guards/google.guard';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from './response/login-response';
import { RegistrationResponse } from './response/registration-response';
import { RefreshResponse } from './response/refresh-response';

@ApiTags('Авторизация')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
  ) {}
  // Логин через гугл
  @ApiOperation({
    summary: 'Логин через гугл',
    description: 'Редиректит на страницу гугла, потом на следующий поинт',
  })
  @ApiResponse({ status: 300 })
  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async googleLogin() {}
  //Поинт после страницы гугла
  @ApiOperation({
    summary: 'Поинт после страницы гугла',
    description:
      'Редиректит на пользовательский урл из GOOGLE_CALLBACK_CLIENT из .env с token в query параметрах, на клиенте должен стоять обработчик который с этим токеном будет делать запрос на следующий поинт',
  })
  @ApiResponse({ status: 300 })
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleCallback(@Req() request: Request, @Res() response: Response) {
    const token = request.user['accesToken'];
    return response.redirect(
      `${process.env.GOOGLE_CALLBACK_CLIENT}?token=${token}`,
    );
  }
  // Получение информации по токену гугла
  @ApiOperation({
    summary: 'Получение информации по токену гугла',
    description:
      'Делаем запрос сюда с token в query, он проверяется через гугл и потом возвращается acces и ставится refresh',
  })
  @ApiResponse({ status: 201, type: LoginResponse })
  @Get('google/get-user')
  async getGoogleUser(
    @Query('token') token: string,
    @Res() response: Response,
  ) {
    return this.httpService
      .get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
      )
      .pipe(
        map(async ({ data: { email } }) => {
          const data = await this.authService.googleAuth(email);
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
        }),
      );
  }
  //Обычный логин через почту и пароль
  @ApiOperation({
    summary: 'Обычный логин',
    description:
      'логин через почту и пароль, пускает только если у пользователя подтверждена почта',
  })
  @ApiResponse({ status: 201, type: LoginResponse })
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
  //Регистрация через логин и пароль
  @ApiOperation({
    summary: 'Регистрация',
    description: 'Регистрирует пользователя и отправляет письмо о входе',
  })
  @ApiResponse({ status: 201, type: RegistrationResponse })
  @Post('registration')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.registration(dto);
    if (!user) {
      throw new BadRequestException('Unable to register user');
    }
    return { message: 'Confirmation email sent!' };
  }
  //Рефреш
  @ApiOperation({
    summary: 'Рефреш информации',
    description:
      'Возвращает новый токен и пользователя, сравнивая токен из куков',
  })
  @ApiResponse({ status: 201, type: RefreshResponse })
  @Get('refresh')
  async refreshTokens(@Cookie('refreshToken') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();
    const data = await this.authService.refresh(refreshToken);
    if (!data) {
      throw new BadRequestException('Unnable to refresh');
    }
    return { accesToken: data.accesToken, user: data.user };
  }
  //Подтверждение почты
  @ApiOperation({
    summary: 'Подтверждение почты',
    description:
      'Происходит после перехода по ссылке из письма, ставит дату когда произошло подтверждение почты, потом редиректит на EMAIL_VERIFY_REDIRECT_URL',
  })
  @ApiResponse({ status: 300 })
  @Get('verify-email/:token')
  async verify(@Param('token') token: string, @Res() res: Response) {
    this.authService.verifyEmail(token);
    res.redirect(`${process.env.EMAIL_VERIFY_REDIRECT_URL}`);
  }
  //Logout
  @ApiOperation({
    summary: 'Выход',
    description: 'удаляет рефреш токен из куков и бд',
  })
  @ApiResponse({ status: 200 })
  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies['refreshToken'];
    if (!token) {
      response.sendStatus(HttpStatus.OK);
      return;
    }
    await this.authService.logout(token);
    response.clearCookie('refreshToken');
    response.sendStatus(HttpStatus.OK);
  }
}
