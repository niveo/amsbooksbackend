import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColecaoLivro } from '../entities';
import { Repository } from 'typeorm';
import { IDataBaseService } from '../interfaces';
import { UsuarioService } from './usuario.service';
import { ColecaoLivroVinculoInputDto } from 'src/models/dtos/colecao-livro-vinculo-input.dto';

@Injectable()
export class ColecaoLivroService implements IDataBaseService<ColecaoLivro> {
  constructor(
    @InjectRepository(ColecaoLivro)
    private readonly repository: Repository<ColecaoLivro>,
    private readonly usuarioService: UsuarioService,
  ) {}

  async getAll(): Promise<{ id: number; descricao: string }[]> {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    const qb = this.repository
      .createQueryBuilder('colecaoLivro')
      .select('colecaoLivro.id', 'id')
      .addSelect('descricao')
      .addSelect('COUNT(livros.id)', 'vinculados')
      .innerJoin('colecaoLivro.usuario', 'usuario')
      .leftJoin('colecaoLivro.livros', 'livros')
      .where('usuario.id = :usuarioId', { usuarioId: usuario.id })
      .groupBy('colecaoLivro.id, colecaoLivro.descricao');

    return qb.getRawMany();
  }

  async create(value: ColecaoLivro) {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    value.usuario = usuario;
    return (await this.repository.save(value)).id;
  }

  async update(id: number, value: ColecaoLivro) {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    value.usuario = usuario;
    return (await this.repository.update(id, value)).affected;
  }

  async delete(id: number): Promise<any> {
    return (await this.repository.delete(id)).affected;
  }

  async obterLivrosIds(colecaoId: number) {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    return this.repository
      .createQueryBuilder('colecaoLivros')
      .select('livros.id', 'id')
      .innerJoin('colecaoLivros.livros', 'livros')
      .innerJoin('colecaoLivros.usuario', 'usuario')
      .where('usuario.id = :usuarioId', { usuarioId: usuario.id })
      .andWhere('colecaoLivros.id = :colecaoId', { colecaoId: colecaoId })
      .getRawMany();
  }

  async createVinculo(value: ColecaoLivroVinculoInputDto) {
    await this.repository.query(
      `INSERT INTO colecoes_has_livros VALUES (${value.colecaoId},${value.livroId})`,
    );
  }

  async deleteVinculo(value: ColecaoLivroVinculoInputDto) {
    await this.repository.query(
      `DELETE FROM  colecoes_has_livros WHERE colecoesLivrosId = ${value.colecaoId} AND livrosId = ${value.livroId}`,
    );
  }
}
