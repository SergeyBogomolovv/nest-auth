import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { SessionSerializer } from './utils/Serializer';

@Module({
  imports: [UsersModule, JwtModule, PrismaModule],
  providers: [AuthService, GoogleStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
