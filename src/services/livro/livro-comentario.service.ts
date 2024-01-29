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
    const usuario = await this.usuarioService.obterUsuarioUserId();

    const qb = this.repository
      .createQueryBuilder('livroComentario')
      .select('livroComentario.id', 'id')
      .addSelect('usuario.nome', 'nome')
      //.addSelect('usuario.id', 'usuarioId')
      .addSelect('livroComentario.displayTime', 'displayTime')
      .addSelect('livroComentario.rate', 'rate')
      .addSelect('livroComentario.texto', 'texto');
    if (usuario) {
      qb.addSelect(
        'CASE usuario.id WHEN ' + usuario.id + ' THEN true ELSE false END ',
        'usuarioComentou',
      );
    }
    qb.innerJoin('livroComentario.usuario', 'usuario').orderBy(
      'livroComentario.displayTime',
      'DESC',
    );
    return qb;
  }

  async delete(id: number): Promise<number> {
    return (
      await this.repository.delete({
        id: id,
      })
    ).affected;
  }
}
