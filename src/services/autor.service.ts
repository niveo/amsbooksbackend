import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Autor } from '../entities';
import { Repository } from 'typeorm';
import { UsuarioService } from './usuario.service';
import { AutorInputDto } from '../models/dtos';
import { IDataBaseService } from '../interfaces';

@Injectable()
export class AutorService implements IDataBaseService<Autor> {
  constructor(
    @InjectRepository(Autor)
    private repository: Repository<Autor>,

    private readonly usuarioService: UsuarioService,
  ) {}

  getAll(): Promise<Autor[]> {
    return this.repository.find({
      cache: true,
    });
  }

  async obterAutorUsuario() {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    return this.repository
      .createQueryBuilder('autor')
      .innerJoin('autor.usuario', 'usuario')
      .where('usuario.id = :id', { id: usuario.id })
      .getOneOrFail();
  }

  async create(autorInputDto: AutorInputDto) {
    return this.repository.save(autorInputDto);
  }

  async createWithUser(autorInputDto: AutorInputDto) {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    return this.repository.save({
      ...autorInputDto,
      usuario: usuario,
    });
  }

  async update(id: number, autorInputDto: AutorInputDto): Promise<number> {
    return (await this.repository.update(id, autorInputDto)).affected;
  }

  async desativarAutor(autorId: number): Promise<number> {
    return (await this.repository.update({ id: autorId }, { ativo: false }))
      .affected;
  }
}
