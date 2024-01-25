import { Module, OnApplicationBootstrap } from '@nestjs/common';
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
} from './services';
import {
  Autor,
  Categoria,
  Idioma,
  Livro,
  LivroCapitulo,
  Tag,
} from './entities';
import {
  CategoriaController,
  LivroController,
  TagController,
} from './controllers';
import { LivroService } from './services/livro/livro.service';
import { AuthModule } from './authorization/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClsModule.forRootAsync({
      useFactory() {
        const ca: ClsModuleFactoryOptions = {
          middleware: {
            // automatically mount the
            // ClsMiddleware for all routes
            mount: true,
            setup: (cls, req) => {
              /* if (
                !converterConfig(configService.get('ENV_PRODUCTION'), Boolean)
              ) {
                cls.set('userId', USER_ID_TEST.userId);
              } else if (req.headers['userid']) {
                const userId = uuidv5(
                  req.headers['userid'],
                  configService.get('AUDIENCE'),
                );
                cls.set('userId', userId);
              }*/
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
          entities: [Idioma, Categoria, Tag, Autor, Livro, LivroCapitulo],
          //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
          synchronize: !converterConfig(process.env.ENV_PRODUCTION, Boolean),
          ssl: converterConfig(process.env.ENV_PRODUCTION, Boolean),
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Idioma,
      Categoria,
      Tag,
      Autor,
      Livro,
      LivroCapitulo,
    ]),
    AuthModule,
  ],
  providers: [
    AppService,
    IdiomaService,
    TagService,
    AutorService,
    CategoriaService,
    SeedingService,
    LivroService,
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
  controllers: [
    AppController,
    LivroController,
    CategoriaController,
    TagController,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly sr: SeedingService) {}
  async onApplicationBootstrap() {
    await this.sr.seed();
  }
}
