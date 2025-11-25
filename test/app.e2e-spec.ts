import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Backend Colegio (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('flujo completo: crea alumno, materia y tarea', async () => {
    const suffix = Date.now(); // para que todo sea único en cada corrida

    // 1. Crear alumno
    const alumnoRes = await request(app.getHttpServer())
      .post('/alumnos')
      .send({
        nombre: 'Pedro',
        email: `pedro${suffix}@example.com`,
        fechaNacimiento: '2001-01-01',
      })
      .expect(201);

    const alumnoId = alumnoRes.body.id;

    // 2. Crear materia
    const materiaRes = await request(app.getHttpServer())
      .post('/materias')
      .send({
        nombre: 'Historia',
        codigo: `HIS${suffix}`,
      })
      .expect(201);

    const materiaId = materiaRes.body.id;

    // 3. Crear tarea asociada
    await request(app.getHttpServer())
      .post('/tareas')
      .send({
        titulo: 'Tarea Historia 1',
        descripcion: 'Leer capítulo 1',
        fechaEntrega: '2025-12-01',
        alumnoId,
        materiaId,
      })
      .expect(201);

    // 4. Consultar tareas
    const tareasRes = await request(app.getHttpServer())
      .get('/tareas')
      .expect(200);

    expect(tareasRes.body.length).toBeGreaterThan(0);

    const tareaCreada = tareasRes.body.find(
      (t: any) => t.alumno.id === alumnoId && t.materia.id === materiaId,
    );

    expect(tareaCreada).toBeDefined();
    expect(tareaCreada.titulo).toBe('Tarea Historia 1');
  });
});
