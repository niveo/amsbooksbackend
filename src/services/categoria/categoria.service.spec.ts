import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { Idioma } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CATEGORIAS } from '../../common';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let dataSource: DataSource;
  let service: CategoriaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Idioma])],
      providers: [CategoriaService],
    }).compile();

    service = app.get<CategoriaService>(CategoriaService);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Ler Categorias', () => {
    it('Deve retornar um registro', async () => {
      const registros = await service.getAll();
      expect(registros).not.toBeNull();
      expect(registros).toHaveLength(CATEGORIAS.length);
    });
  });
});
