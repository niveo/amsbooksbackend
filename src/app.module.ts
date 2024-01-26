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
} from './services';
import {
  Autor,
  Categoria,
  Idioma,
  Livro,
  LivroCapitulo,
  LivroComentario,
  Tag,
  Usuario,
} from './entities';
import {
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
          ],
          //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
          synchronize: !converterConfig(process.env.ENV_PRODUCTION, Boolean),
          ssl: converterConfig(process.env.ENV_PRODUCTION, Boolean),
          logging: false,
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
    ]),
    AuthModule,
  ],
  controllers: [
    AppController,
    LivroController,
    CategoriaController,
    TagController,
    LivroComentarioController,
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
