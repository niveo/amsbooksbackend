import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ColecaoLivroVinculoInputDto } from '../models/dtos/colecao-livro-vinculo-input.dto';
import { ColecaoLivroService } from './colecao-livro.service';
import { UsuarioService } from './usuario.service';

@Injectable()
export class ColecaoLivroVinculoService {
  constructor(
    private readonly repository: DataSource,

    private readonly colecaoLivroService: ColecaoLivroService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async getAll(livroId: number): Promise<any> {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    const query = `
    SELECT "CL"."id" AS "id", descricao, 
    CASE WHEN "CHL"."livrosId" IS NOT NULL THEN 1 ELSE 0 END vinculado 
    FROM "colecoes_livros" "CL" 
    INNER JOIN "usuarios" "usuario" ON "usuario"."id"="CL"."usuarioId" AND ("usuario"."removido" IS NULL) 
    LEFT OUTER JOIN  "colecoes_has_livros" "CHL" ON "CHL"."colecoesLivrosId" = "CL"."id" AND "CHL"."livrosId" = ${livroId} 
    WHERE ( "usuario"."id" = ${usuario.id} ) 
    AND ( "CL"."removido" IS NULL )`;
    return this.repository.query(query);
  }

  async create(value: ColecaoLivroVinculoInputDto) {
    await this.colecaoLivroService.createVinculo(value);
  }

  async delete(value: ColecaoLivroVinculoInputDto) {
    await this.colecaoLivroService.deleteVinculo(value);
  }
}
