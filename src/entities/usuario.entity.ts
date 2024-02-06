import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { ColecaoLivro } from './colecao-livro.entity';
import { Autor } from './autor.entity';

export const NOME_TABELA_USUARIO = 'usuarios';

@Unique('UNQ_AUTOR_ID', ['autor'])
@Entity({
  name: NOME_TABELA_USUARIO,
})
export class Usuario extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
  })
  nome: string;

  @Index()
  @Column('text', {
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  @Index()
  @Column('text', {
    nullable: false,
    unique: true,
  })
  userId?: string;

  @OneToOne(() => Autor, (user) => user.usuario, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  autor?: Autor;

  @ManyToMany(() => ColecaoLivro, {
    cascade: true,
    createForeignKeyConstraints: false,
    //onDelete: 'RESTRICT' *não é implementado pelo typeorm,
  })
  @JoinTable({
    name: 'usuario_has_colecoes',
  })
  colecoesLivros?: ColecaoLivro[];
}
