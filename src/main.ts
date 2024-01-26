import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /*
    origin e credentials é usado para pegar a sessao do usuario
  */
  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
    methods: ['*'],
    allowedHeaders: ['Authorization', 'Content-Type', 'userid'],
    maxAge: 86400,
  });

  app.use(
    session({
      name: 'amsbooks_session',
      secret: 'dVqLrUwWYbX3RKpExWXvWBKWq4gOFrXm',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 100,
      },
    }),
  );

  app.use(
    helmet({
      hsts: { maxAge: 31536000 },
      frameguard: { action: 'deny' },
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'frame-ancestors': ["'none'"],
        },
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
