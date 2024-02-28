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
  LivroPerfilUsuario,
  Tag,
  Usuario,
} from '../entities';
import { ConfigService } from '@nestjs/config';

export const ENTITIES = [
  Usuario,
  Idioma,
  Categoria,
  Tag,
  Autor,
  Livro,
  LivroCapitulo,
  LivroComentario,
  ColecaoLivro,
  LivroPerfilUsuario,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.ENV_PRODUCTION.toBoolean()) {
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
            synchronize: false,
            ssl: true,
            logging: false,
          };
        } else {
          return {
            type: 'sqlite',
            database: './db/file.db',
            //dropSchema: true,
            synchronize: true,
            entities: ENTITIES,
            logging: process.env.ENV_TYPEORM_LOG.toBoolean(),
          };
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(ENTITIES),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DataBaseModule {}
