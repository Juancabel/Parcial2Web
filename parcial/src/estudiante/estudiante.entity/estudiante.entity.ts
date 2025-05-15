import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
@Entity()
export class EstudianteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  cedula: number;

  @Column()
  semestre: number;

  @Column()
  programa: string;

  @Column()
  promedio: number;

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.estudiante)
  proyectos: ProyectoEntity[];
}
