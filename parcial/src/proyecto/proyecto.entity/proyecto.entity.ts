import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity/evaluacion.entity';
import { ProfesorEntity } from '../../profesor/profesor.entity/profesor.entity';

@Entity()
export class ProyectoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column()
  presupuesto: number;

  @Column()
  notafinal: number;

  @Column()
  estado: number;

  @Column()
  fechainicio: string;

  @Column()
  fechafin: string;

  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.proyectos)
  estudiante: EstudianteEntity;

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.proyecto)
  evaluaciones: EvaluacionEntity[];

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.proyectos)
  profesor: ProfesorEntity;
}
