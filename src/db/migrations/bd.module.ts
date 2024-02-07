import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
} from '../../entities';
import { converterConfig } from 'src/common/utils';
import { ConfigService } from '@nestjs/config';

const ENTITIES = [
  Usuario,
  Idioma,
  Categoria,
  Tag,
  Autor,
  Livro,
  LivroCapitulo,
  LivroComentario,
  ColecaoLivro,
];

@Module({
  imports: [
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
          entities: ENTITIES,
          //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
          synchronize: !converterConfig(process.env.ENV_PRODUCTION, Boolean),
          ssl: converterConfig(process.env.ENV_PRODUCTION, Boolean),
          logging: converterConfig(process.env.ENV_TYPEORM_LOG, Boolean),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(ENTITIES),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DataBaseModule {}
