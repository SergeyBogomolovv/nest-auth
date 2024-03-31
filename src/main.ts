import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: process.env.CLIET_URL });
  app.use(passport.initialize());
  const config = new DocumentBuilder()
    .setTitle('Nest.js auth')
    .setDescription('Auth app on nest.js with acces/refresh tokens, 2FA, OAuth')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(PORT, () => console.log(`Started on ${PORT}`));
}

bootstrap();
