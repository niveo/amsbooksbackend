import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Livro } from './livro.entity';
import { Usuario } from './usuario.entity';
import { Exclude } from 'class-transformer';

export const NOME_TABELA_LIVRO_COMENTARIOS = 'livros_comentarios';

@Entity({
  name: NOME_TABELA_LIVRO_COMENTARIOS,
})
export class LivroComentario {
  @Column('text', {
    nullable: false,
  })
  texto: string;

  @Column('timestamp', {
    nullable: false,
  })
  displayTime?: Date;

  @Exclude()
  @CreateDateColumn()
  cadastrado?: Date;

  @Column('integer', {
    nullable: false,
  })
  rate?: number;

  @Exclude()
  @Index()
  @PrimaryColumn({
    type: 'integer',
  })
  @OneToOne(() => Usuario, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  usuario?: Usuario;

  @Index()
  @PrimaryColumn({
    type: 'integer',
  })
  @ManyToOne(() => Livro, (metadata) => metadata.comentarios, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  livro?: Livro;
}
