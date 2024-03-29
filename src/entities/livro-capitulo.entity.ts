import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Livro } from './livro.entity';

export const NOME_TABELA_LIVRO_CAPITULO = 'livros_capitulos';

@Entity({
  name: NOME_TABELA_LIVRO_CAPITULO,
})
export class LivroCapitulo extends BaseEntity {
  @Index()
  @Column({
    nullable: false,
  })
  titulo: string;

  @Column({
    nullable: false,
  })
  capitulo: number;

  @Column({
    nullable: false,
  })
  texto: string;

  @ManyToOne(() => Livro, (metadata) => metadata.capitulos, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  livro?: Livro;
}
