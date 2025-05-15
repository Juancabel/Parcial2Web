import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity/evaluacion.entity';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
@Entity()
export class ProfesorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  cedula: number;

  @Column()
  departamento: string;

  @Column()
  extension: number;

  @Column()
  esparevaluado: boolean;

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.profesor)
  evaluaciones: EvaluacionEntity[];

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.profesor)
  proyectos: ProyectoEntity[];
}
