import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Alumno } from '../alumnos/alumno.entity';
import { Materia } from '../materias/materia.entity';

@Entity()
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ type: 'date' })
  fechaEntrega: string;

  @ManyToOne(() => Alumno, { eager: true })
  alumno: Alumno;

  @ManyToOne(() => Materia, { eager: true })
  materia: Materia;
}
