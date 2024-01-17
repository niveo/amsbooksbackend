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
              const userId = uuidv5(
                req.headers['userid'],
                configService.get('AUDIENCE'),
              );
              cls.set('userId', userId);
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
          type: 'postgres',
          host: config.get('PGHOST'),
          port: 5432,
          username: config.get('PGUSER'),
          url: config.get('DATABASE_URL'),
          password: config.get('PGPASSWORD'),
          database: config.get('PGDATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
          synchronize: !converterConfig(
            config.get<boolean>('ENV_PRODUCTION'),
            Boolean,
          ),
          ssl: converterConfig(config.get<boolean>('ENV_PRODUCTION'), Boolean),
          logging: false,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
