import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaluacionModule } from './evaluacion/evaluacion.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ProfesorModule } from './profesor/profesor.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { EvaluacionEntity } from './evaluacion/evaluacion.entity/evaluacion.entity';
import { EstudianteEntity } from './estudiante/estudiante.entity/estudiante.entity';
import { ProfesorEntity } from './profesor/profesor.entity/profesor.entity';
import { ProyectoEntity } from './proyecto/proyecto.entity/proyecto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    EvaluacionModule,
    EstudianteModule,
    ProfesorModule,
    ProyectoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'museum',
      entities: [
        EvaluacionEntity,
        ProyectoEntity,
        EstudianteEntity,
        ProfesorEntity,
      ],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
