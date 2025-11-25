import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Materia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  codigo: string;
}
