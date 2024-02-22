import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColecaoLivro } from '../entities';
import { Repository } from 'typeorm';
import { IDataBaseService } from '../interfaces';
import { UsuarioService } from './usuario.service';

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
}
