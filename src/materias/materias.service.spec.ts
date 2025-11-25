import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MateriasService } from './materias.service';
import { Materia } from './materia.entity';

describe('MateriasService (unit)', () => {
  let service: MateriasService;
  let repo: Repository<Materia>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MateriasService,
        {
          provide: getRepositoryToken(Materia),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MateriasService>(MateriasService);
    repo = module.get<Repository<Materia>>(getRepositoryToken(Materia));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create debe guardar una materia', async () => {
    const dto = { nombre: 'Matemáticas', codigo: 'MAT101' };
    (repo.create as jest.Mock).mockReturnValue(dto);
    (repo.save as jest.Mock).mockResolvedValue({ id: 1, ...dto });

    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('findOne debe buscar la materia por id', async () => {
    const materia = { id: 3, nombre: 'Física', codigo: 'FIS101' } as any;
    (repo.findOne as jest.Mock).mockResolvedValue(materia);

    const result = await service.findOne(3);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 3 } });
    expect(result).toBe(materia);
  });

  it('remove debe llamar a delete en el repo', async () => {
    (repo.delete as jest.Mock).mockResolvedValue(undefined);

    await service.remove(7);

    expect(repo.delete).toHaveBeenCalledWith(7);
  });

  
});
