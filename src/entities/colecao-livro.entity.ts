import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { Exclude } from 'class-transformer';
import { Usuario } from './usuario.entity';
import { Livro } from './livro.entity';

export const NOME_TABELA_COLECAO_LIVROS = 'colecoes_livros';

@Entity({ name: NOME_TABELA_COLECAO_LIVROS })
export class ColecaoLivro extends BaseEntity {
  @Index()
  @Column({
    nullable: false,
  })
  descricao: string;

  @Exclude()
  @Index()
  @ManyToOne(() => Usuario, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  usuario?: Usuario;

  @ManyToMany(() => Livro, (metadata) => metadata.colecoes, {
    cascade: true,
    createForeignKeyConstraints: false,
    //onDelete: 'RESTRICT' *não é implementado pelo typeorm,
  })
  @JoinTable({ name: 'colecoes_has_livros' })
  livros?: Livro[];
}
