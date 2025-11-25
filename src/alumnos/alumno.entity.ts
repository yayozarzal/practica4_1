import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Alumno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento?: string;
}
