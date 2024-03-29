import { LivroService, UsuarioService } from '../services';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LivroComentario } from '../entities';
import { Repository } from 'typeorm';
import { LivroComentarioInputDto } from '../models/dtos';

@Injectable()
export class LivroComentarioService {
  constructor(
    @Inject(forwardRef(() => LivroService))
    private readonly livroService: LivroService,

    private readonly usuarioService: UsuarioService,

    @InjectRepository(LivroComentario)
    private readonly repository: Repository<LivroComentario>,
  ) {}

  async create(comentarioInput: LivroComentarioInputDto) {
    const livro = await this.livroService.findOneOrFail(
      comentarioInput.livroId,
    );
    const usuario = await this.usuarioService.obterUsuarioUserId();
    const comentario = new LivroComentario();
    comentario.livro = livro;
    comentario.usuario = usuario;
    comentario.texto = comentarioInput.texto;
    comentario.rate = comentarioInput.rate;
    comentario.displayTime = new Date();
    const registro = await this.repository.save(comentario);
    return (await this.selecaoQueryDefault())
      .where('livroComentario.id = :id', { id: registro.id })
      .getRawOne();
  }

  async getComentariosLivro(livroId: number): Promise<any[]> {
    return (await this.selecaoQueryDefault())
      .where('livroComentario.livroId = :livroId', { livroId: livroId })
      .limit(10)
      .getRawMany();
  }

  private async selecaoQueryDefault() {
    return this.repository
      .createQueryBuilder('livroComentario')
      .select('livroComentario.id', 'id')
      .addSelect('usuario.nome', 'nome')
      .addSelect('usuario.userId', 'userId')
      .addSelect('livroComentario.displayTime', 'displayTime')
      .addSelect('livroComentario.rate', 'rate')
      .addSelect('livroComentario.texto', 'texto')
      .innerJoin('livroComentario.usuario', 'usuario')
      .orderBy('livroComentario.displayTime', 'ASC');
  }

  async getComentarioIdLivroUsuario(livroId: number) {
    const usuario = await this.usuarioService.obterUsuarioUserId();
    return this.repository.findOne({
      select: {
        id: true,
      },
      relations: {
        livro: true,
        usuario: true,
      },
      where: {
        livro: {
          id: livroId,
        },
        usuario: {
          id: usuario.id,
        },
      },
    });
  }

  async delete(id: number): Promise<number> {
    return (
      await this.repository.delete({
        id: id,
      })
    ).affected;
  }
}
