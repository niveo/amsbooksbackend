import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { Autor } from './autor.entity';
import { Idioma } from './idiomas.entity';
import { Categoria } from './categoria.entity';
import { LivroCapitulo } from './livro-capitulo.entity';

@Entity()
export class Livro extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
  })
  titulo: string;

  @ManyToOne(() => Autor, (metadata) => metadata.livros, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  autor?: Autor;

  @Index()
  @OneToOne(() => Idioma)
  @JoinColumn()
  idioma: Idioma;

  @Index()
  @OneToOne(() => Categoria)
  @JoinColumn()
  categoria: Categoria;

  @Column('timestamp', {
    nullable: true,
  })
  publicado?: Date;

  @Column('text')
  descritivo: string;

  @OneToMany(() => LivroCapitulo, (metadata) => metadata.livro, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  capitulos: LivroCapitulo[];
}
