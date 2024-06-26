import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { options } from 'src/auth/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [JwtModule.registerAsync(options()), CacheModule.register()],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
