import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { Livro } from './livro.entity';
import { BaseEntity } from './base-entity';
import { Usuario } from './usuario.entity';

export const NOME_TABELA_AUTOR = 'autores';

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

  @Column('text', {
    nullable: true,
  })
  descricao?: string;

  @OneToMany(() => Livro, (metadata) => metadata.autor, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  livros?: Livro[];

  @OneToOne(() => Usuario, (metadata) => metadata.autor)
  usuario?: Usuario;
}
