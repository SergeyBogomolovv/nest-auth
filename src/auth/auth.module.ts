import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { options } from './config';
import { TokensModule } from 'src/tokens/tokens.module';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(options()),
    PassportModule,
    TokensModule,
    MailModule,
  ],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  controllers: [AuthController],
})
export class AuthModule {}
