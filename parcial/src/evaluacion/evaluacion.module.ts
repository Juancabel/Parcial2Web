import { Module } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { EvaluacionController } from './evaluacion.controller';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';

@Module({
  providers: [EvaluacionService],
  imports: [TypeOrmModule.forFeature([EvaluacionEntity, ProyectoEntity])],
  controllers: [EvaluacionController],
})
export class EvaluacionModule {}
