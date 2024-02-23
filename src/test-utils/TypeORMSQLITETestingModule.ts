import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '../modules';
import { ClsModule } from 'nestjs-cls';

export const TypeOrmSQLITETestingModule = () => [
  ClsModule,
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ENTITIES,
    synchronize: true,
  }),
  TypeOrmModule.forFeature(ENTITIES),
];
