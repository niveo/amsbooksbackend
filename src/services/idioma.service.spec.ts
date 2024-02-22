import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { IdiomaService } from './idioma.service';
import { DataSource } from 'typeorm';
import { Idioma } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDIOMAS } from '../common';

describe('IdiomaService', () => {
  let dataSource: DataSource;
  let service: IdiomaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Idioma])],
      providers: [IdiomaService],
    }).compile();

    service = app.get<IdiomaService>(IdiomaService);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Ler Idiomas', () => {
    it('Deve retornar um registro', async () => {
      const registros = await service.getAll();
      expect(registros).not.toBeNull();
      expect(registros).toHaveLength(IDIOMAS.length);
    });
  });
});
