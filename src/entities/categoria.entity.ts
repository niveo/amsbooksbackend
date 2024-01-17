import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity({
  name: 'categorias',
})
export class Categoria extends BaseEntity {
  @Index()
  @Column('text', {
    nullable: false,
    unique: true,
  })
  nome: string;
}
