import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import {
  NOME_TABELA_AUTOR,
  NOME_TABELA_LIVRO,
  NOME_TABELA_LIVRO_CAPITULO,
  NOME_TABELA_LIVRO_COMENTARIOS,
  NOME_TABELA_TAG,
  NOME_TABELA_USUARIO,
} from '../entities';
import { v5 } from 'uuid';

@Injectable()
export class ManutencaoBancoService {
  constructor(private readonly entityManager: EntityManager) {}

  async iniciar(): Promise<void> {
    await this.entityManager.transaction(async (tr) => {
      await this.createColumnTable(
        tr.queryRunner,
        NOME_TABELA_AUTOR,
        new TableColumn({
          type: 'text',
          name: 'url',
          isNullable: true,
        }),
      );

      await this.createColumnTable(
        tr.queryRunner,
        NOME_TABELA_USUARIO,
        new TableColumn({
          type: 'int',
          name: 'autorId',
          isNullable: true,
        }),
      );

      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_USUARIO,
        NOME_TABELA_AUTOR,
        ['id'],
        ['autorId'],
        'RESTRICT',
      );

      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_LIVRO,
        NOME_TABELA_AUTOR,
        ['id'],
        ['autorId'],
      );

      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_LIVRO_CAPITULO,
        NOME_TABELA_LIVRO,
        ['id'],
        ['livroId'],
        'CASCADE',
      );

      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_LIVRO_COMENTARIOS,
        NOME_TABELA_USUARIO,
        ['id'],
        ['usuarioId'],
        'CASCADE',
      );

      /* await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_COLECAO_LIVROS,
        NOME_TABELA_USUARIO,
        ['id'],
        ['usuarioId'],
        'CASCADE',
      );

      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_COLECAO_LIVRO_ITEM,
        NOME_TABELA_COLECAO_LIVROS,
        ['id'],
        ['colecaoLivroId'],
        'CASCADE',
      );

      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_COLECAO_LIVRO_ITEM,
        NOME_TABELA_LIVRO,

        ['id'],
        ['livroId'],
        'RESTRICT',
      );*/

      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_LIVRO_COMENTARIOS,
        NOME_TABELA_LIVRO,
        ['id'],
        ['livroId'],
        'CASCADE',
      );

      await this.criarFk(
        tr.queryRunner,
        'livros_has_tags',
        NOME_TABELA_LIVRO,
        ['id'],
        ['livrosId'],
      );

      await this.criarFk(
        tr.queryRunner,
        'livros_has_tags',
        NOME_TABELA_TAG,
        ['id'],
        ['tagsId'],
        'RESTRICT',
      );
    });
  }

  private async createColumnTable(
    queryRunner: QueryRunner,
    table: string,
    column: TableColumn,
  ) {
    const columns = (await queryRunner.getTable(table)).columns;
    if (columns.findIndex((fi) => fi.name === column.name) === -1) {
      await queryRunner.addColumn(table, column);
    }
  }

  private async criarFk(
    queryRunner: QueryRunner,
    tabela: string,
    tabelaReferencia: string,
    camposReferencia: string[],
    campos: string[],
    onDelete: 'CASCADE' | 'RESTRICT' = 'CASCADE',
  ) {
    const tabelaExiste = await queryRunner.getTable(tabela);
    if (tabelaExiste) {
      const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
      const nomeFk =
        'FK_' +
        v5(
          `${tabela}_${tabelaReferencia}_${camposReferencia.join(',')}_${campos.join(',')}_${onDelete}`,
          MY_NAMESPACE,
        );

      const indexFk = tabelaExiste.foreignKeys.findIndex(
        (f) => f.name === nomeFk,
      );

      //console.log(tabela, tabelaReferencia, nomeFk, indexFk);

      if (indexFk !== -1) return;
      await queryRunner.createForeignKey(
        tabela,
        new TableForeignKey({
          name: nomeFk, //'FK_' + v4().replaceAll('-', '')
          referencedTableName: tabelaReferencia,
          referencedColumnNames: camposReferencia,
          columnNames: campos,
          onDelete: onDelete,
        }),
      );
    }
  }
}
