import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { Livro } from './livro.entity';
import { BaseEntity } from './base-entity';
import { Usuario } from './usuario.entity';

export const NOME_TABELA_AUTOR = 'autores';

@Unique('UNQ_USUARIO_ID', ['usuario'])
@Entity({
  name: NOME_TABELA_AUTOR,
})
export class Autor extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
  })
  nome: string;

  @Column('boolean', {
    nullable: false,
    default: true,
  })
  ativo?: boolean;

  @Column('text', { nullable: true })
  url?: string;

  @Exclude()
  @Index()
  @OneToOne(() => Usuario, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  usuario?: Usuario;

  @Column('text', {
    nullable: true,
  })
  descricao?: string;

  @OneToMany(() => Livro, (metadata) => metadata.autor, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  livros?: Livro[];
}
