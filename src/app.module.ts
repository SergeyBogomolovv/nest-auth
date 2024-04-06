import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { FilesModule } from './files/files.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    TokensModule,
    MailModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FilesModule,
    PostsModule,
  ],
})
export class AppModule {}
