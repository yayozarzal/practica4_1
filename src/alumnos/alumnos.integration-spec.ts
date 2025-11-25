import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumnosService } from './alumnos.service';
import { Alumno } from './alumno.entity';

describe('AlumnosService (integration)', () => {
  let service: AlumnosService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Alumno],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Alumno]),
      ],
      providers: [AlumnosService],
    }).compile();

    service = module.get<AlumnosService>(AlumnosService);
  });

  it('crea y obtiene un alumno desde BD real', async () => {
    await service.create({ nombre: 'Ana', email: 'ana@test.com' });
    const alumnos = await service.findAll();

    expect(alumnos.length).toBe(1);
    expect(alumnos[0].nombre).toBe('Ana');
  });
});
