import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { User } from '@prisma/client';
import { TokensService } from 'src/tokens/tokens.service';
import * as uuid from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from 'src/users/responses/user.response';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private mailService: MailService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}
  async registration(dto: RegisterDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (user) throw new ConflictException('User is already exists');
    if (dto.password !== dto.passwordRepeat)
      throw new BadRequestException('Passwords aren`t match');
    const verifyLink = uuid.v4();
    this.mailService.sendActivationMail({
      to: dto.email,
      link: `${this.configService.get('SERVER_URL')}/auth/verify-email/${verifyLink}`,
    });
    const newUser = await this.usersService
      .create({ ...dto, verifyLink })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    return new UserResponse(newUser);
  }
  async login(dto: LoginDto) {
    const user: User = await this.usersService
      .findOneByEmail(dto.email, true)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.emailVerified) {
      throw new UnauthorizedException('Email is not verified');
    }
    const accesToken = this.tokensService.generateAccesToken(user);
    const refreshToken = await this.tokensService.generateRefreshToken(user.id);
    return { accesToken, refreshToken, user: new UserResponse(user) };
  }
  async logout(token: string) {
    await this.tokensService.deleteRefreshToken(token);
    return { succes: true };
  }
  async refresh(token: string) {
    const dbToken = await this.tokensService.getRefreshToken(token);
    if (!dbToken) throw new UnauthorizedException();
    if (new Date(dbToken.exp) < new Date()) {
      await this.tokensService.deleteRefreshToken(token);
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOneById(dbToken.userId, true);
    const accesToken = this.tokensService.generateAccesToken(user);
    return { user: new UserResponse(user), accesToken };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { verifyLink: token },
    });
    if (!user) throw new UnauthorizedException();
    await this.prisma.user.update({
      where: { verifyLink: token },
      data: { emailVerified: new Date() },
    });
  }
  async googleAuth(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException();
    const accesToken = this.tokensService.generateAccesToken(user);
    const refreshToken = await this.tokensService.generateRefreshToken(user.id);
    return { accesToken, refreshToken, user: new UserResponse(user) };
  }
}
