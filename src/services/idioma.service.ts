import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Idioma } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class IdiomaService {
  constructor(
    @InjectRepository(Idioma)
    private repository: Repository<Idioma>,
  ) {}

  getAll(): Promise<Idioma[]> {
    return this.repository.find({
      cache: true,
    });
  }
}
