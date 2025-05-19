/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ProfesorEntity } from '../profesor/profesor.entity/profesor.entity';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let proyectoRepo: Repository<ProyectoEntity>;
  let estudianteRepo: Repository<EstudianteEntity>;
  let profesorRepo: Repository<ProfesorEntity>;

  let estudiante: EstudianteEntity;
  let proyectoSinEst: ProyectoEntity;
  let proyectoConEst: ProyectoEntity;
  let proyectoMaxEstado: ProyectoEntity;
  let profesor: ProfesorEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProyectoService],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    proyectoRepo = module.get<Repository<ProyectoEntity>>(getRepositoryToken(ProyectoEntity));
    estudianteRepo = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    profesorRepo = module.get<Repository<ProfesorEntity>>(getRepositoryToken(ProfesorEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await proyectoRepo.clear();
    await estudianteRepo.clear();

    estudiante = await estudianteRepo.save({
      nombre: 'Juan Test',
      cedula: 12345678,
      semestre: 5,
      programa: 'Ingeniería',
      promedio: 4.0,
      proyectos: [],
    });

    proyectoSinEst = await proyectoRepo.save({
      titulo: 'A'.repeat(16),
      area: 'Ciencia',
      presupuesto: 100,
      notafinal: 0,
      estado: 1,
      fechainicio: new Date().toISOString(),
      fechafin: new Date().toISOString(),
      estudiante: undefined,
      profesor: undefined,
      evaluaciones: [],
    });

    proyectoConEst = await proyectoRepo.save({
      titulo: 'B'.repeat(16),
      area: 'Arte',
      presupuesto: 200,
      notafinal: 0,
      estado: 2,
      fechainicio: new Date().toISOString(),
      fechafin: new Date().toISOString(),
      estudiante: estudiante,
      profesor: undefined,
      evaluaciones: [],
    });

    proyectoMaxEstado = await proyectoRepo.save({
      titulo: 'C'.repeat(16),
      area: 'Tech',
      presupuesto: 300,
      notafinal: 0,
      estado: 4,
      fechainicio: new Date().toISOString(),
      fechafin: new Date().toISOString(),
      estudiante: undefined,
      profesor: undefined,
      evaluaciones: [],
    });

    profesor = await profesorRepo.save({
      nombre: faker.person.fullName(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      departamento: faker.word.words(2),
      extension: faker.number.int({ min: 10000, max: 99999 }),
      esparevaluado: false,
      proyectos: [],
      evaluaciones: [],
    });
  };

  it('crearProyecto should save and return a project when valid', async () => {
    const proyecto: ProyectoEntity = {
      id: '',
      titulo: 'Valid Title Longer',
      area: 'Test',
      presupuesto: 50,
      notafinal: 0,
      estado: 0,
      fechainicio: new Date().toISOString(),
      fechafin: new Date().toISOString(),
      estudiante: estudiante,
      profesor: profesor,
      evaluaciones: [],
    };

    const saved = await service.crearProyecto(proyecto);
    expect(saved).toBeDefined();
    expect(saved.id).toBeDefined();

    const found = await proyectoRepo.findOne({ where: { id: saved.id } });
    expect(found).not.toBeNull();
  });

  it('crearProyecto should throw BadRequestException when invalid', async () => {
    const proyecto: ProyectoEntity = {
      id: '',
      titulo: 'Short',
      area: 'Test',
      presupuesto: 0,
      notafinal: 0,
      estado: 0,
      fechainicio: new Date().toISOString(),
      fechafin: new Date().toISOString(),
      estudiante: estudiante,
      profesor: profesor,
      evaluaciones: [],
    };

    await expect(service.crearProyecto(proyecto)).rejects.toThrow(BadRequestException);
  });

  it('avanzarProyecto should increment estado when below max', async () => {
    const original = proyectoSinEst;
    const updated = await service.avanzarProyecto(original.id);
    expect(updated.estado).toEqual(original.estado + 1);
  });

  it('avanzarProyecto should throw when project not found', async () => {
    await expect(service.avanzarProyecto('no-id')).rejects.toThrow(BadRequestException);
  });

  it('avanzarProyecto should throw when at max estado', async () => {
    await expect(service.avanzarProyecto(proyectoMaxEstado.id)).rejects.toThrow(BadRequestException);
  });

  it('findEstudianteByProyectoId should return estudiante when assigned', async () => {
    const result = await service.findEstudianteByProyectoId(proyectoConEst.id);
    expect(result).toMatchObject({ id: estudiante.id, nombre: estudiante.nombre });
  });

  it('findEstudianteByProyectoId should throw when project not found', async () => {
    await expect(service.findEstudianteByProyectoId('no-id')).rejects.toThrow(BadRequestException);
  });

  it('findEstudianteByProyectoId should throw when no estudiante assigned', async () => {
    await expect(service.findEstudianteByProyectoId(proyectoSinEst.id)).rejects.toThrow(BadRequestException);
  });
});
