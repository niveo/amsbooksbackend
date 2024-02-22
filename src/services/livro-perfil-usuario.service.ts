import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LivroPerfilUsuario } from '../entities';
import { LivroPerfilUsuarioInputDto } from '../models/dtos';
import { UsuarioService } from './usuario.service';
import { LivroService } from './livro.service';

@Injectable()
export class LivroPerfilUsuarioService {
  constructor(
    @InjectRepository(LivroPerfilUsuario)
    private readonly repository: Repository<LivroPerfilUsuario>,
    private readonly usuarioService: UsuarioService,
    private readonly livroService: LivroService,
  ) {}

  async get(livroId: number) {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    return this.repository
      .createQueryBuilder('livroPerfilUsuario')
      .select('livroPerfilUsuario.situacaoLeitura', 'situacaoLeitura')
      .innerJoin('livroPerfilUsuario.livro', 'livro')
      .innerJoin('livroPerfilUsuario.usuario', 'usuario')
      .where('livro.id = :livroId', { livroId: livroId })
      .andWhere('usuario.id = :usuarioId', { usuarioId: usuario.id })
      .getRawOne();
  }

  async upsert(value: LivroPerfilUsuarioInputDto) {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    const livro = await this.livroService.findOneOrFail(value.livroId);
    (
      await this.repository.upsert(
        {
          usuario: usuario,
          livro: livro,
          situacaoLeitura: value.situacaoLeitura,
        },
        ['usuario', 'livro'],
      )
    ).identifiers;
  }
}
