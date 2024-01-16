import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { Livro } from './livro.entity';

@Entity()
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
  ativo: boolean;

  @Exclude()
  @Index()
  @Column('text', {
    nullable: false,
  })
  userId: string;

  @Column('text', {
    nullable: true,
  })
  descricao: string;

  @OneToMany(() => Livro, (metadata) => metadata.autor, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  livros: Livro[];
}
