import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async create(evaluacion: EvaluacionEntity): Promise<EvaluacionEntity> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: evaluacion.proyecto.id },
      relations: ['profesor'],
    });

    if (!proyecto) {
      throw new BadRequestException('Proyecto no encontrado');
    }
    if (
      proyecto.profesor &&
      evaluacion.profesor &&
      proyecto.profesor.id === evaluacion.profesor.id
    ) {
      throw new BadRequestException(
        'El profesor evaluador no puede ser el mentor del proyecto',
      );
    }

    return await this.evaluacionRepository.save(evaluacion);
  }
}
