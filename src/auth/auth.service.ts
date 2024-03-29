import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { User } from '@prisma/client';
import { TokensService } from 'src/tokens/tokens.service';
import * as uuid from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

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
    const verifyLink = uuid.v4();
    await this.mailService.sendActivationMail({
      to: dto.email,
      link: `${this.configService.get('SERVER_URL')}/auth/verify-email/${verifyLink}`,
    });
    const newUser = await this.usersService
      .create({ ...dto, verifyLink })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    return newUser;
  }
  async login(dto: LoginDto): Promise<Tokens> {
    const user: User = await this.usersService
      .findOneByEmail(dto.email)
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
    return { accesToken, refreshToken };
  }
  async logout(token: string) {
    await this.tokensService.deleteRefreshToken(token);
    return { succes: true };
  }
  async refresh(token: string) {
    const dbToken = await this.tokensService.getRefreshToken(token);
    if (!dbToken || new Date(dbToken.exp) < new Date()) {
      await this.tokensService.deleteRefreshToken(token);
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOneById(dbToken.userId);
    return this.tokensService.generateAccesToken(user);
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
    return 'Email verified';
  }
}
