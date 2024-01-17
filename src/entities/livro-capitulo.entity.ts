import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Livro } from './livro.entity';

@Entity({
  name: 'livros_capitulos'
})
export class LivroCapitulo extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
  })
  titulo: string;

  @Column('integer', {
    nullable: false,
  })
  capitulo: number;

  @Column('text', {
    nullable: false,
  })
  texto: string;

  @ManyToOne(() => Livro, (metadata) => metadata.capitulos, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  livro?: Livro;
}
