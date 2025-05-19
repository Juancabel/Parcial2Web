import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorService } from './profesor.service';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BadRequestException } from '@nestjs/common';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let repository: Repository<ProfesorEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProfesorService],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    repository = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );

    await repository.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearProfesor should save and return a new profesor when extension has 5 digits', async () => {
    const profesor: ProfesorEntity = {
      id: '',
      nombre: 'Juan Pérez',
      cedula: 12345678,
      departamento: 'Matemáticas',
      extension: 12345,
      esparevaluado: false,
      proyectos: [],
      evaluaciones: [],
    };

    const saved = await service.crearProfesor(profesor);
    expect(saved).toBeDefined();
    expect(saved.id).toBeDefined();

    const found = await repository.findOne({ where: { id: saved.id } });
    expect(found).not.toBeNull();
  });

  it('crearProfesor should throw BadRequestException when extension does not have 5 digits', async () => {
    const profesor: ProfesorEntity = {
      id: '',
      nombre: 'María Gómez',
      cedula: 87654321,
      departamento: 'Física',
      extension: 1234,
      esparevaluado: false,
      proyectos: [],
      evaluaciones: [],
    };

    await expect(service.crearProfesor(profesor)).rejects.toThrow(
      BadRequestException,
    );
  });
});
