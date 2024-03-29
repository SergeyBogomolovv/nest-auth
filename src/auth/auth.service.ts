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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {}
  async registration(dto: RegisterDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (user) throw new ConflictException('User is already exists');
    const newUser = await this.usersService.create(dto).catch((err) => {
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
    const accesToken = this.tokensService.generateAccesToken(user);
    const refreshToken = await this.tokensService.generateRefreshToken(user.id);
    return { accesToken, refreshToken };
  }
  async refresh(token: string): Promise<Tokens> {
    const dbToken = await this.tokensService.getRefreshToken(token);
    if (!dbToken) throw new UnauthorizedException();
    await this.tokensService.deleteRefreshToken(token);
    const user = await this.usersService.findOneById(dbToken.userId);
    const accesToken = this.tokensService.generateAccesToken(user);
    const refreshToken = await this.tokensService.generateRefreshToken(user.id);
    return { accesToken, refreshToken };
  }
}
