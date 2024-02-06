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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClsModule, ClsModuleFactoryOptions } from 'nestjs-cls';
import { converterConfig } from './common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  Autor,
  Categoria,
  ColecaoLivro,
  Idioma,
  Livro,
  LivroCapitulo,
  LivroComentario,
  Tag,
  Usuario,
} from './entities';
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
              } catch (e) {}
            },
          },
        };
        return ca;
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          extra: { max: 10 },
          migrations: [],
          migrate: true,
          migrationsRun: true,
          type: 'postgres',
          host: process.env.PGHOST,
          port: 5432,
          username: process.env.PGUSER,
          url: process.env.DATABASE_URL,
          password: process.env.PGPASSWORD,
          database: process.env.PGDATABASE,
          entities: [
            Usuario,
            Idioma,
            Categoria,
            Tag,
            Autor,
            Livro,
            LivroCapitulo,
            LivroComentario,
            ColecaoLivro,
          ],
          //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
          synchronize: !converterConfig(process.env.ENV_PRODUCTION, Boolean),
          ssl: converterConfig(process.env.ENV_PRODUCTION, Boolean),
          logging: converterConfig(process.env.ENV_TYPEORM_LOG, Boolean),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Usuario,
      Idioma,
      Categoria,
      Tag,
      Autor,
      Livro,
      LivroCapitulo,
      LivroComentario,
      ColecaoLivro,
    ]),
    AuthModule,
  ],
  controllers: [
    AppController,
    LivroController,
    CategoriaController,
    TagController,
    LivroComentarioController,
    LivroHistoricoUsuarioController,
    AutorController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
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
