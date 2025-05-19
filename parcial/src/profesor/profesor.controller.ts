import { Controller, Post, Body } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProfesorService } from './profesor.service';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { ProfesorDto } from './profesor.dto/profesor.dto';

@Controller('profesores')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}
  @Post()
  async create(@Body() dto: ProfesorDto): Promise<ProfesorEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const profesor = plainToInstance(ProfesorEntity, {
      nombre: dto.nombre,
      cedula: dto.cedula,
      departamento: dto.departamento,
      extension: dto.extension,
      esparevaluado: dto.esparevaluado,
    });
    return await this.profesorService.crearProfesor(profesor);
  }
}
