import { Controller, Post, Param } from '@nestjs/common';

import { ProfesorEvaluacionService } from './profesor-evaluacion.service';
import { ProfesorEntity } from '../profesor/profesor.entity/profesor.entity';

@Controller('profesores')
export class ProfesorEvaluacionController {
  constructor(
    private readonly profesorEvaluacionService: ProfesorEvaluacionService,
  ) {}

  @Post(':profesorId/evaluaciones/:evaluacionId')
  async asignarEvaluador(
    @Param('profesorId') profesorId: string,
    @Param('evaluacionId') evaluacionId: string,
  ): Promise<ProfesorEntity> {
    return this.profesorEvaluacionService.asignarEvaluador(
      profesorId,
      evaluacionId,
    );
  }
}
