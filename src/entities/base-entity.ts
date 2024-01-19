import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
  })
  id?: number;

  @Exclude()
  @CreateDateColumn()
  cadastrado?: Date;

  @Exclude()
  @UpdateDateColumn()
  atualizado?: Date;

  @Exclude()
  @DeleteDateColumn()
  removido?: Date;

  //Versão sera usado como revisão
  @Exclude()
  @VersionColumn()
  versao?: number;
}
