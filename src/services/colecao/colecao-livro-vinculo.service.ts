import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColecaoLivro } from '../../entities';
import { DataSource } from 'typeorm';
import { UsuarioService } from '../usuario/usuario.service';
import { ColecaoLivroVinculoInputDto } from 'src/models/dtos/colecao-livro-vinculo-input.dto';

@Injectable()
export class ColecaoLivroVinculoService {
  constructor(
    @InjectRepository(ColecaoLivro)
    private readonly repository: DataSource,
    private readonly usuarioService: UsuarioService,
  ) {}

  async getAll(livroId: number): Promise<any> {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    return this.repository
      .query(`SELECT "colecaoLivro"."id" AS "id", descricao, CASE WHEN CHL.livrosId IS NOT NULL THEN 1 ELSE 0 END vinculado 
      FROM "colecoes_livros" "colecaoLivro" 
      INNER JOIN "usuarios" "usuario" ON "usuario"."id"="colecaoLivro"."usuarioId" AND 
      ("usuario"."removido" IS NULL) 
      LEFT OUTER JOIN  colecoes_has_livros AS CHL ON CHL.colecoesLivrosId = colecaoLivro.id AND CHL.livrosId = ${livroId} 
      WHERE ( "usuario"."id" = ${usuario.id} ) 
      AND ( "colecaoLivro"."removido" IS NULL )`);
  }

  async create(value: ColecaoLivroVinculoInputDto) {
    await this.repository.query(
      `INSERT INTO colecoes_has_livros VALUES (${value.colecaoId},${value.livroId})`,
    );
  }

  async delete(value: ColecaoLivroVinculoInputDto) {
    await this.repository.query(
      `DELETE FROM  colecoes_has_livros WHERE colecoesLivrosId = ${value.colecaoId} AND livrosId = ${value.livroId}`,
    );
  }
}
