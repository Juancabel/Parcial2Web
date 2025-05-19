/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorEvaluacionService } from './profesor-evaluacion.service';
import { ProfesorEntity } from '../profesor/profesor.entity/profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity/evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';

describe('ProfesorEvaluacionService', () => {
  let service: ProfesorEvaluacionService;
  let profesorRepo: Repository<ProfesorEntity>;
  let evaluacionRepo: Repository<EvaluacionEntity>;
  let proyectoRepo: Repository<ProyectoEntity>;

  let profesor: ProfesorEntity;
  let evaluacion: EvaluacionEntity;
  let proyecto: ProyectoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProfesorEvaluacionService],
    }).compile();

    service = module.get<ProfesorEvaluacionService>(ProfesorEvaluacionService);
    profesorRepo = module.get<Repository<ProfesorEntity>>(getRepositoryToken(ProfesorEntity));
    evaluacionRepo = module.get<Repository<EvaluacionEntity>>(getRepositoryToken(EvaluacionEntity));
    proyectoRepo = module.get<Repository<ProyectoEntity>>(getRepositoryToken(ProyectoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await evaluacionRepo.clear();
    await profesorRepo.clear();
    await proyectoRepo.clear();


    profesor = await profesorRepo.save({
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
  profesor: profesor, 
  evaluaciones: [],   
});

    evaluacion = await evaluacionRepo.save({
      proyecto,
      profesor,
    });
  };

  it('asignarEvaluador should assign a professor to an evaluation successfully', async () => {
    const updatedProfesor = await service.asignarEvaluador(profesor.id, evaluacion.id);

    expect(updatedProfesor.id).toEqual(profesor.id);

    const storedEval = await evaluacionRepo.findOne({
      where: { id: evaluacion.id },
      relations: ['profesor'],
    });
    expect(storedEval).not.toBeNull();
  });

  it('asignarEvaluador should throw BadRequestException if professor not found', async () => {
    await expect(
      service.asignarEvaluador('non-existent-id', evaluacion.id),
    ).rejects.toThrow(BadRequestException);
  });

  it('asignarEvaluador should throw BadRequestException if evaluation not found', async () => {
    await expect(
      service.asignarEvaluador(profesor.id, 'non-existent-eval-id'),
    ).rejects.toThrow(BadRequestException);
  });

  it('asignarEvaluador should throw BadRequestException if professor has already 3 evaluations', async () => {
    for (let i = 0; i < 3; i++) {
      await evaluacionRepo.save({ proyecto, profesor });
    }
    await expect(
      service.asignarEvaluador(profesor.id, evaluacion.id),
    ).rejects.toThrow(BadRequestException);
  });
});
