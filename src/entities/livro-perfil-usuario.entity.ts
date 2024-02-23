import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Livro } from './livro.entity';

export const NOME_TABELA_LIVRO_PERFIL_USUARIO = 'livros_perfil_usuarios';

@Entity({
  name: NOME_TABELA_LIVRO_PERFIL_USUARIO,
})
export class LivroPerfilUsuario {
  @Column()
  situacaoLeitura: number;

  @PrimaryColumn({ type: 'int', name: 'usuarioId' })
  @OneToOne(() => Usuario, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  usuario: Usuario;

  @PrimaryColumn({ type: 'int', name: 'livroId' })
  @OneToOne(() => Livro, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  livro: Livro;
}
