import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { EntityNotFoundExceptionFilter, HttpExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /*
    origin e credentials é usado para pegar a sessao do usuario
  */
  app.enableCors({
    origin: [
      '*',
      'http://localhost:4200',
      'http://192.168.0.129:4200',
      'https://amsbooksfrontend.onrender.com',
    ],
    //Apenas para sessão
    //credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'authorization',
      'Content-Type',
      'userid',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Origin',
    ],
    maxAge: 86400,
  });

  /**
   * Não sera mais necessario usar a sessão para verificar se o usuário esta ativo
   */
  /*   
  import * as session from 'express-session';
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
  */

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
