import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { Tarea } from './tarea.entity';
import { Alumno } from '../alumnos/alumno.entity';
import { Materia } from '../materias/materia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea, Alumno, Materia])],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}
