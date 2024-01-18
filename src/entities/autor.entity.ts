import { Exclude } from 'class-transformer';
import { Column, Entity, Index, OneToMany, Unique } from 'typeorm';
import { Livro } from './livro.entity';
import { BaseEntity } from './base-entity';

export const NOME_TABELA_AUTOR = 'autores';

@Unique('UNQ_NOME_USERID', ['nome', 'userId'])
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
    default: false,
  })
  foto?: boolean = false;

  @Column('boolean', {
    nullable: false,
    default: true,
  })
  ativo?: boolean = true;

  @Exclude()
  @Index()
  @Column('text', {
    nullable: false,
  })
  userId: string;

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
