import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlumnosService } from './alumnos.service';
import { Alumno } from './alumno.entity';

describe('AlumnosService (unit)', () => {
  let service: AlumnosService;
  let repo: Repository<Alumno>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlumnosService,
        {
          provide: getRepositoryToken(Alumno),
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

    service = module.get<AlumnosService>(AlumnosService);
    repo = module.get<Repository<Alumno>>(getRepositoryToken(Alumno));
  });

  it('create debe guardar un alumno', async () => {
    const dto = { nombre: 'Juan', email: 'juan@test.com' };
    (repo.create as jest.Mock).mockReturnValue(dto);
    (repo.save as jest.Mock).mockResolvedValue({ id: 1, ...dto });

    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('findAll debe retornar arreglo', async () => {
    const data = [{ id: 1, nombre: 'A', email: 'a@test.com' }];
    (repo.find as jest.Mock).mockResolvedValue(data);

    const result = await service.findAll();

    expect(result).toBe(data);
  });

   it('findOne debe llamar al repo con el id correcto', async () => {
    const alumno = { id: 10, nombre: 'Luis', email: 'luis@test.com' } as any;
    (repo.findOne as jest.Mock).mockResolvedValue(alumno);

    const result = await service.findOne(10);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
    expect(result).toBe(alumno);
  });

  it('remove debe llamar a delete en el repo', async () => {
    (repo.delete as jest.Mock).mockResolvedValue(undefined);

    await service.remove(5);

    expect(repo.delete).toHaveBeenCalledWith(5);
  });

  
});
