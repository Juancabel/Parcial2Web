import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async crearProyecto(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.titulo.length > 15 && proyecto.presupuesto > 0) {
      return await this.proyectoRepository.save(proyecto);
    }
    throw new BadRequestException('No cumple');
  }
  async avanzarProyecto(id: string): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });

    if (!proyecto) {
      throw new BadRequestException('Proyecto no encontrado');
    }

    if (proyecto.estado >= 4) {
      throw new BadRequestException('El proyecto ya está en su estado máximo');
    }

    proyecto.estado += 1;
    return await this.proyectoRepository.save(proyecto);
  }

  async findEstudianteByProyectoId(id: string): Promise<EstudianteEntity> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: ['estudiante'],
    });

    if (!proyecto) {
      throw new BadRequestException('Proyecto no encontrado');
    }

    if (!proyecto.estudiante) {
      throw new BadRequestException(
        'El proyecto no tiene estudiantes asignados',
      );
    }

    return proyecto.estudiante;
  }
}
