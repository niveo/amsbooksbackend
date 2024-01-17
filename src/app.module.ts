import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClsModule, ClsModuleFactoryOptions } from 'nestjs-cls';
import { converterConfig } from './common/utils';
import { v5 as uuidv5 } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from './authorization/authorization.guard';
import { IdiomaService } from './services';
import { USER_ID_TEST } from './common';
import { Idioma } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClsModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const ca: ClsModuleFactoryOptions = {
          middleware: {
            // automatically mount the
            // ClsMiddleware for all routes
            mount: true,
            setup: (cls, req) => {
              if (
                !converterConfig(configService.get('ENV_PRODUCTION'), Boolean)
              ) {
                cls.set('userId', USER_ID_TEST.userId);
              } else if (req.headers['userid']) {
                const userId = uuidv5(
                  req.headers['userid'],
                  configService.get('AUDIENCE'),
                );
                cls.set('userId', userId);
              }
            },
          },
        };
        return ca;
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          extra: { max: 10 },
          migrations: [],
          migrate: true,
          migrationsRun: true,
          type: 'postgres',
          host: config.get('PGHOST'),
          port: 5432,
          username: config.get('PGUSER'),
          url: config.get('DATABASE_URL'),
          password: config.get('PGPASSWORD'),
          database: config.get('PGDATABASE'),
          entities: [Idioma],
          //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
          synchronize: !converterConfig(
            config.get<boolean>('ENV_PRODUCTION'),
            Boolean,
          ),
          ssl: converterConfig(config.get<boolean>('ENV_PRODUCTION'), Boolean),
          logging: true,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Idioma]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IdiomaService,
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
