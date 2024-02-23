import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private repository: Repository<Categoria>,
    private dataSource: DataSource,
  ) {}

  getAll(): Promise<any[]> {
    return this.dataSource.query(`
      WITH livrosCategorias AS (
        SELECT livros."categoriaId", count(*) as contaLivros FROM livros group by "categoriaId"
      )
      SELECT categorias.id, categorias.nome, livrosCategorias.contaLivros FROM categorias
      left outer join livrosCategorias ON livrosCategorias."categoriaId" = categorias.id
      order by categorias.nome
    `);
  }
}
