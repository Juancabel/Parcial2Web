import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async crearEstudiante(
    estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    if (estudiante.promedio > 3.2 && estudiante.semestre >= 4) {
      return await this.estudianteRepository.save(estudiante);
    }
    throw new BadRequestException(BadRequestException);
  }
  async eliminarEstudiante(id: string) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
    });
    if (!estudiante) {
      throw new BadRequestException(BadRequestException);
    }
    await this.estudianteRepository.remove(estudiante);
  }
}
