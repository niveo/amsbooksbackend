import { Injectable } from '@nestjs/common';
import { EntityManager, QueryRunner, TableForeignKey } from 'typeorm';
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
      await this.criarFk(
        tr.queryRunner,
        NOME_TABELA_AUTOR,
        NOME_TABELA_USUARIO,
        ['id'],
        ['usuarioId'],
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
          `${tabela}_${tabelaReferencia}_${camposReferencia.join(',')}_${campos.join(',')}`,
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