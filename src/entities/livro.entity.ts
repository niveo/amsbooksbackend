import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
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

export const NOME_TABELA_LIVRO = 'livros';

@Entity({
  name: NOME_TABELA_LIVRO,
})
export class Livro extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
  })
  titulo: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
  })
  isbn13?: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
  })
  isbn10?: string;

  @ManyToOne(() => Autor, (metadata) => metadata.livros, {
    nullable: false,
    createForeignKeyConstraints: false,
    //onDelete: 'CASCADE' *não é implementado pelo typeorm,
  })
  autor: Autor;

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
  capa?: boolean = false;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  liberarTraducao?: boolean = false;

  @Index()
  @OneToOne(() => Categoria, {
    nullable: false,
  })
  @JoinColumn()
  categoria: Categoria;

  @ManyToMany(() => Tag, {
    cascade: true,
    createForeignKeyConstraints: false,
    //onDelete: 'RESTRICT' *não é implementado pelo typeorm,
  })
  @JoinTable({
    name: 'livros_has_tags',
  })
  tags?: Tag[];

  @Column({
    type: 'enum',
    enum: NivelLeitura,
    default: NivelLeitura.UNDEFINED,
  })
  nivelLeitura: NivelLeitura = NivelLeitura.UNDEFINED;

  @Column('timestamp', {
    nullable: true,
  })
  publicado?: Date;

  @Column('text')
  descritivo: string;

  @OneToMany(() => LivroCapitulo, (metadata) => metadata.livro, {
    cascade: true,
    createForeignKeyConstraints: false,
    //onDelete: 'CASCADE' *não é implementado pelo typeorm,
  })
  capitulos?: LivroCapitulo[];
}
