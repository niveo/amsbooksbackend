import { AuthService } from './authorization/auth.service';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Request } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClsModule, ClsModuleFactoryOptions } from 'nestjs-cls';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from './authorization/authorization.guard';
import {
  CategoriaService,
  IdiomaService,
  TagService,
  AutorService,
  SeedingService,
  LivroComentarioService,
  LivroHistoricoUsuarioService,
} from './services';

import {
  AutorController,
  CategoriaController,
  LivroComentarioController,
  LivroController,
  TagController,
} from './controllers';
import { LivroService } from './services/livro/livro.service';
import { AuthModule } from './authorization/auth.module';
import { UsuarioMiddleware } from './middlewares/usuario.middleware';
import { UsuarioService } from './services/usuario/usuario.service';
import { ManutencaoBancoService } from './services/manutencao-banco.service';
import { LivroHistoricoUsuarioController } from './controllers/livro/livro-historico-usuario.controller';
import { DataBaseModule } from './db/migrations/bd.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClsModule.forRootAsync({
      useFactory(authService: AuthService) {
        const ca: ClsModuleFactoryOptions = {
          middleware: {
            // automatically mount the
            // ClsMiddleware for all routes
            mount: true,
            setup: (cls, req: Request) => {
              try {
                const data = authService.getDataToken(req);
                cls.set('userId', data.sub);
              } catch (e) {
                console.error(e);
              }
            },
          },
        };
        return ca;
      },
      imports: [AuthModule],
      inject: [AuthService],
    }),
    AuthModule,
    DataBaseModule,
  ],
  controllers: [
    AppController,
    LivroController,
    CategoriaController,
    TagController,
    LivroComentarioController,
    LivroHistoricoUsuarioController,
    AutorController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    AuthService,
    UsuarioService,
    LivroService,
    AppService,
    IdiomaService,
    TagService,
    AutorService,
    CategoriaService,
    SeedingService,
    ManutencaoBancoService,
    LivroComentarioService,
    LivroHistoricoUsuarioService,
  ],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
  constructor(
    private readonly manutencaoBancoService: ManutencaoBancoService,
    private readonly seedingService: SeedingService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsuarioMiddleware).forRoutes('*');
  }

  async onApplicationBootstrap() {
    await this.manutencaoBancoService.iniciar();
    await this.seedingService.iniciar();
  }
}
