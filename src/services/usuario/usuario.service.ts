import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

  findOneOrFail(id: number) {
    return this.repository.findOneOrFail({
      where: {
        id: id,
      },
    });
  }

  salvar(autor: Usuario) {
    return this.repository.save(autor);
  }

  replace(autor: Usuario) {
    return this.repository.upsert(autor, ['email']);
  }
}
