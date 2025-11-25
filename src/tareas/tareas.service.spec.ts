import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TareasService } from './tareas.service';
import { Tarea } from './tarea.entity';
import { Alumno } from '../alumnos/alumno.entity';
import { Materia } from '../materias/materia.entity';
import { NotFoundException } from '@nestjs/common';

describe('TareasService (unit)', () => {
  let service: TareasService;
  let tareasRepo: Repository<Tarea>;
  let alumnosRepo: Repository<Alumno>;
  let materiasRepo: Repository<Materia>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TareasService,
        {
          provide: getRepositoryToken(Tarea),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Alumno),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Materia),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TareasService>(TareasService);
    tareasRepo = module.get<Repository<Tarea>>(getRepositoryToken(Tarea));
    alumnosRepo = module.get<Repository<Alumno>>(getRepositoryToken(Alumno));
    materiasRepo = module.get<Repository<Materia>>(getRepositoryToken(Materia));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create debe crear una tarea cuando alumno y materia existen', async () => {
    (alumnosRepo.findOne as jest.Mock).mockResolvedValue({ id: 1 } as Alumno);
    (materiasRepo.findOne as jest.Mock).mockResolvedValue({ id: 2 } as Materia);
    (tareasRepo.create as jest.Mock).mockReturnValue({ titulo: 'X' });
    (tareasRepo.save as jest.Mock).mockResolvedValue({ id: 99, titulo: 'X' });

    const dto = {
      titulo: 'Tarea prueba',
      descripcion: 'desc',
      fechaEntrega: '2025-12-01',
      alumnoId: 1,
      materiaId: 2,
    };

    const result = await service.create(dto as any);

    expect(alumnosRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(materiasRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(tareasRepo.create).toHaveBeenCalled();
    expect(tareasRepo.save).toHaveBeenCalled();
    expect(result.id).toBe(99);
  });
   it('create debe lanzar NotFoundException si el alumno no existe', async () => {
    (alumnosRepo.findOne as jest.Mock).mockResolvedValue(null); // alumno no encontrado
    (materiasRepo.findOne as jest.Mock).mockResolvedValue({ id: 2 } as Materia);

    const dto = {
      titulo: 'Tarea prueba',
      descripcion: 'desc',
      fechaEntrega: '2025-12-01',
      alumnoId: 123,
      materiaId: 2,
    };

    await expect(service.create(dto as any)).rejects.toBeInstanceOf(NotFoundException);
    expect(alumnosRepo.findOne).toHaveBeenCalledWith({ where: { id: 123 } });
  });

  it('create debe lanzar NotFoundException si la materia no existe', async () => {
    (alumnosRepo.findOne as jest.Mock).mockResolvedValue({ id: 1 } as Alumno);
    (materiasRepo.findOne as jest.Mock).mockResolvedValue(null); // materia no encontrada

    const dto = {
      titulo: 'Tarea prueba',
      descripcion: 'desc',
      fechaEntrega: '2025-12-01',
      alumnoId: 1,
      materiaId: 999,
    };

    await expect(service.create(dto as any)).rejects.toBeInstanceOf(NotFoundException);
    expect(materiasRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
