import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Livro } from './livro.entity';
import { Usuario } from './usuario.entity';
import { Exclude } from 'class-transformer';

export const NOME_TABELA_LIVRO_COMENTARIOS = 'livros_comentarios';

@Unique('UNQ_USUARIO_LIVRO', ['usuario', 'livro'])
@Entity({
  name: NOME_TABELA_LIVRO_COMENTARIOS,
})
export class LivroComentario {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({
    nullable: false,
  })
  texto: string;

  @Column({
    nullable: false,
  })
  displayTime?: Date;

  @Exclude()
  @CreateDateColumn()
  cadastrado?: Date;

  @Column({
    nullable: false,
  })
  rate?: number;

  @Exclude()
  @Index()
  @OneToOne(() => Usuario, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  usuario?: Usuario;

  @Index()
  @ManyToOne(() => Livro, (metadata) => metadata.comentarios, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  livro?: Livro;
}
