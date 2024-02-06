import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Autor } from '../../entities';
import { Repository } from 'typeorm';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable()
export class AutorService {
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
    return usuario.autor;
  }

  salvar(autor: Autor) {
    return this.repository.save(autor);
  }

  async desativarAutor(autorId: number): Promise<number> {
    return (await this.repository.update({ id: autorId }, { ativo: false }))
      .affected;
  }
}
