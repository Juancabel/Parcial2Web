import { Controller, Post, Put, Get, Param, Body } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { ProyectoDto } from './proyecto.dto/proyecto.dto';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async create(@Body() dto: ProyectoDto): Promise<ProyectoEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const proyecto = plainToInstance(ProyectoEntity, dto);
    return await this.proyectoService.crearProyecto(proyecto);
  }

  @Put(':id/avanzar')
  async avanzar(@Param('id') id: string): Promise<ProyectoEntity> {
    return await this.proyectoService.avanzarProyecto(id);
  }

  @Get(':id/estudiante')
  async getEstudiante(@Param('id') id: string) {
    return await this.proyectoService.findEstudianteByProyectoId(id);
  }
}
