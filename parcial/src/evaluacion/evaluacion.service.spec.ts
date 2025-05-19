import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';
import { ProfesorEntity } from '../profesor/profesor.entity/profesor.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let evaluacionRepo: Repository<EvaluacionEntity>;
  let proyectoRepo: Repository<ProyectoEntity>;
  let profesorRepo: Repository<ProfesorEntity>;

  let proyecto: ProyectoEntity;
  let profesorMentor: ProfesorEntity;
  let profesorEvaluador: ProfesorEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EvaluacionService],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    evaluacionRepo = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );
    proyectoRepo = module.get<Repository<ProyectoEntity>>(
      getRepositoryToken(ProyectoEntity),
    );
    profesorRepo = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await evaluacionRepo.clear();
    await proyectoRepo.clear();
    await profesorRepo.clear();

    profesorMentor = await profesorRepo.save({
      nombre: faker.person.fullName(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      departamento: faker.word.words(2),
      extension: faker.number.int({ min: 10000, max: 99999 }),
      esparevaluado: false,
      proyectos: [],
      evaluaciones: [],
    });

    profesorEvaluador = await profesorRepo.save({
      nombre: faker.person.fullName(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      departamento: faker.word.words(2),
      extension: faker.number.int({ min: 10000, max: 99999 }),
      esparevaluado: false,
      proyectos: [],
      evaluaciones: [],
    });

    proyecto = await proyectoRepo.save({
      titulo: faker.word.words(3),
      area: faker.word.adjective(),
      presupuesto: faker.number.int({ min: 1000, max: 10000 }),
      notafinal: 0,
      estado: 1,
      fechainicio: faker.date.past().toISOString(),
      fechafin: faker.date.future().toISOString(),
      profesor: profesorMentor,
      evaluaciones: [],
    });
  };

  it('create should save a new evaluation when evaluator ≠ mentor', async () => {
    const evaluacion: EvaluacionEntity = {
      id: '',
      proyecto,
      profesor: profesorEvaluador,
    };

    const result = await service.create(evaluacion);
    expect(result.id).toBeDefined();

    const stored = await evaluacionRepo.findOne({
      where: { id: result.id },
      relations: ['proyecto', 'profesor'],
    });
    expect(stored).not.toBeNull();
  });

  it('create should throw BadRequestException if project not found', async () => {
    const evaluacion: EvaluacionEntity = {
      id: '',
      proyecto: { id: 'does-not-exist' } as ProyectoEntity,
      profesor: profesorEvaluador,
    };

    await expect(service.create(evaluacion)).rejects.toThrow(
      BadRequestException,
    );
  });
});
