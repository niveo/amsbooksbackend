import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../../entities';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
    private readonly cls: ClsService,
  ) {}

  findOneOrFail(id: number) {
    return this.repository.findOneOrFail({
      where: {
        id: id,
      },
    });
  }

  obterUsuarioUserId() {
    if (!this.cls.get('userId')) throw 'Usuário não registrado no Cls';
    return this.repository.findOneOrFail({
      where: {
        userId: this.cls.get('userId'),
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
