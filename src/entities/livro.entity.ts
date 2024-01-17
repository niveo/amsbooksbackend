import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { Autor } from './autor.entity';
import { Idioma } from './idioma.entity';
import { Categoria } from './categoria.entity';
import { LivroCapitulo } from './livro-capitulo.entity';
import { Tag } from './tag.entity';
import { NivelLeitura } from './../enuns/nivel-leitura.enum';

@Entity({
  name: 'livros',
})
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
  @OneToOne(() => Idioma, {
    nullable: false,
  })
  @JoinColumn()
  idioma: Idioma;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  capa: boolean = false;

  @Index()
  @OneToOne(() => Categoria, {
    nullable: false,
  })
  @JoinColumn()
  categoria: Categoria;

  @ManyToMany(() => Tag)
  @JoinColumn()
  tags: Tag[];

  @Column({
    type: 'enum',
    enum: NivelLeitura,
    default: NivelLeitura.UNDEFINED,
  })
  nivelLeitura: NivelLeitura;

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
