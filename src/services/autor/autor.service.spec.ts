import { UsuarioService } from './../usuario/usuario.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AutorService } from './autor.service';
import { TypeOrmSQLITETestingModule } from '../../test-utils/TypeORMSQLITETestingModule';
import { ClsService } from 'nestjs-cls';
import { UUIDRandom } from '../../common/utils';
import { createMock } from '@golevelup/ts-jest';

describe('AutorService', () => {
  let service: AutorService;
  let cls: ClsService;
  const mockCUsuarioService = createMock<UsuarioService>();

  const DATA_STUB = {
    descricao: 'TESTE',
    nome: 'TESTE',
  };
  const USUARIO_STUB = {
    nome: 'TESTE',
    email: 'teste@gmail.com',
    userId: UUIDRandom(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [
        { provide: UsuarioService, useValue: mockCUsuarioService },
        AutorService,
      ],
    }).compile();

    service = app.get<AutorService>(AutorService);
    cls = app.get(ClsService);
  });

  describe('Registrar Autor', () => {
    it('Tem que retornar objeto salvo', async () => {
      const data = await service.create(DATA_STUB);

      const { descricao } = data;
      expect(descricao).toEqual(DATA_STUB.descricao);
    });
  });

  describe('Registrar Autor Usuário', () => {
    it('Tem que retornar objeto salvo', async () => {
      mockCUsuarioService.obterUsuarioUserId.mockImplementationOnce(() =>
        Promise.resolve(USUARIO_STUB),
      );

      const { usuario, descricao } = await cls.runWith(
        {
          [USUARIO_STUB.userId]: USUARIO_STUB.userId,
        },
        () => service.createWithUser(DATA_STUB),
      );

      expect(usuario).not.toBeNull();
      expect(usuario.userId).toEqual(USUARIO_STUB.userId);

      expect(descricao).toEqual(DATA_STUB.descricao);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
