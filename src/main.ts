import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600 * 1000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  const config = new DocumentBuilder()
    .setTitle('Nest js auth')
    .setDescription('Creating auth with nest and next js')
    .setVersion('1.0.0')
    .addTag('Gerax')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(PORT, () => console.log(`Started on ${PORT}`));
}

bootstrap();
