/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';
import { ProfesorEntity } from '../profesor/profesor.entity/profesor.entity';
import { EvaluacionDto } from './evaluacion.dto/evaluacion.dto';
@Controller('evaluaciones')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}
  @Post()
  async create(@Body() dto: EvaluacionDto): Promise<EvaluacionEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const evaluacion = plainToInstance(EvaluacionEntity, {
      proyecto: { id: dto.proyectoId } as ProyectoEntity,
      profesor: { id: dto.profesorId } as ProfesorEntity,
    });
    return this.evaluacionService.create(evaluacion);
  }
}
