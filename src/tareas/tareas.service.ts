import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { Alumno } from '../alumnos/alumno.entity';
import { Materia } from '../materias/materia.entity';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareasRepo: Repository<Tarea>,
    @InjectRepository(Alumno)
    private readonly alumnosRepo: Repository<Alumno>,
    @InjectRepository(Materia)
    private readonly materiasRepo: Repository<Materia>,
  ) {}

  async create(dto: CreateTareaDto) {
    const alumno = await this.alumnosRepo.findOne({ where: { id: dto.alumnoId } });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');

    const materia = await this.materiasRepo.findOne({ where: { id: dto.materiaId } });
    if (!materia) throw new NotFoundException('Materia no encontrada');

    const tarea = this.tareasRepo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      fechaEntrega: dto.fechaEntrega,
      alumno,
      materia,
    });

    return this.tareasRepo.save(tarea);
  }

  findAll() {
    return this.tareasRepo.find(); // trae alumno y materia por eager: true
  }
}
