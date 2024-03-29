import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { options } from './config';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(options()),
    PassportModule,
    TokensModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
