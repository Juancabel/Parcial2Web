import { Module } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';

@Module({
  providers: [EvaluacionService],
  imports: [TypeOrmModule.forFeature([EvaluacionEntity])],
})
export class EvaluacionModule {}
