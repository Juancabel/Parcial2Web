import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorEntity } from '../../profesor/profesor.entity/profesor.entity';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity/evaluacion.entity';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      ProfesorEntity,
      ProyectoEntity,
      EvaluacionEntity,
      EstudianteEntity,
    ],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    ProfesorEntity,
    ProyectoEntity,
    EvaluacionEntity,
    EstudianteEntity,
  ]),
];
