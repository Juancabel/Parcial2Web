import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorEntity } from '../profesor/profesor.entity/profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity/evaluacion.entity';

@Injectable()
export class ProfesorEvaluacionService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,

    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  async asignarEvaluador(
    profesorId: string,
    evaluacionId: string,
  ): Promise<ProfesorEntity> {
    const profesor: ProfesorEntity | null =
      await this.profesorRepository.findOne({
        where: { id: profesorId },
        relations: ['evaluaciones'],
      });

    if (!profesor) {
      throw new BadRequestException('Profesor no encontrado');
    }

    if (profesor.evaluaciones.length >= 3) {
      throw new BadRequestException(
        'El profesor ya tiene 3 o más evaluaciones asignadas',
      );
    }

    const evaluacion = await this.evaluacionRepository.findOne({
      where: { id: evaluacionId },
      relations: ['profesor'],
    });

    if (!evaluacion) {
      throw new BadRequestException('Evaluación no encontrada');
    }

    evaluacion.profesor = profesor;
    await this.evaluacionRepository.save(evaluacion);

    return await this.profesorRepository.save(profesor);
  }
}
