import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { IdiomaService } from './idioma.service';
import { DataSource } from 'typeorm';
import { Idioma } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('IdiomaService', () => {
  let dataSource: DataSource;
  let idiomaServices: IdiomaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Idioma])],
      providers: [IdiomaService],
    }).compile();

    idiomaServices = app.get<IdiomaService>(IdiomaService);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(idiomaServices).toBeDefined();
  });

  describe('Salvar Idioma', () => {
    it('Tem que retornar objeto salvo', async () => {
      const idiomaData: Idioma = {
        nome: 'English',
      };
      const idiomaCriado = await idiomaServices.create(idiomaData);
      const { nome } = idiomaCriado;
      expect(nome).toEqual(idiomaData.nome);
    });
  });
});
