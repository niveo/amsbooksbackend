import { LivroService, UsuarioService } from 'src/services';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LivroComentario } from 'src/entities';
import { Repository } from 'typeorm';
import { LivroComentarioInputDto } from 'src/models/dtos';

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
    return this.selecaoQueryDefault()
      .where('livroComentario.id = :id', { id: registro.id })
      .getRawOne();
  }

  getComentariosLivro(livroId: number): Promise<any[]> {
    return this.selecaoQueryDefault()
      .where('livroComentario.livroId = :livroId', { livroId: livroId })
      .limit(10)
      .getRawMany();
  }

  private selecaoQueryDefault() {
    return this.repository
      .createQueryBuilder('livroComentario')
      .select('livroComentario.id', 'id')
      .addSelect('usuario.nome', 'nome')
      .addSelect('usuario.id', 'usuarioId')
      .addSelect('livroComentario.displayTime', 'displayTime')
      .addSelect('livroComentario.rate', 'rate')
      .addSelect('livroComentario.texto', 'texto')
      .innerJoin('livroComentario.usuario', 'usuario')
      .orderBy('livroComentario.displayTime', 'DESC');
  }

  async getIdComentarioLivroUsuario(livroId: number) {
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
