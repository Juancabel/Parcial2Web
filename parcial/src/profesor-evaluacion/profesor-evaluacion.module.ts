import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorEntity } from '../profesor/profesor.entity/profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity/evaluacion.entity';
import { ProfesorEvaluacionService } from './profesor-evaluacion.service';
import { ProfesorEvaluacionController } from './profesor-evaluacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProfesorEntity, EvaluacionEntity])],
  providers: [ProfesorEvaluacionService],
  controllers: [ProfesorEvaluacionController],
})
export class ProfesorEvaluacionModule {}
