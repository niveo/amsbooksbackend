import { AuthService } from './../authorization/auth.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Request } from 'express';
import { ClsModule, ClsModuleFactoryOptions } from 'nestjs-cls';
import { AuthModule } from '../authorization/auth.module';

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
  ],
  providers: [],
  exports: [ConfigModule, ClsModule],
})
export class CoreModule {}
