import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { options } from 'src/auth/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtModule.registerAsync(options())],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
