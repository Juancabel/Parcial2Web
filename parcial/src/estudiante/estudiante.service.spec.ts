/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<EstudianteEntity>;
  let estudiantesList: EstudianteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    estudiantesList = [];

    for (let i = 0; i < 5; i++) {
      const estudiante = await repository.save({
        nombre: faker.person.fullName(),
        cedula: faker.number.int({ min: 10000000, max: 99999999 }),
        semestre: faker.number.int({ min: 4, max: 10 }),
        programa: faker.word.words(2),
        promedio: faker.number.float({ min: 3.3, max: 5.0 }),
      });
      estudiantesList.push(estudiante);
    }
  };

  it('crearEstudiante should save and return a new estudiante if conditions are met', async () => {
    const estudiante: EstudianteEntity = {
      id: '',
      nombre: faker.person.fullName(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      semestre: 6,
      programa: faker.word.words(2),
      promedio: 3.5,
      proyectos: [],
    };

    const savedEstudiante = await service.crearEstudiante(estudiante);
    expect(savedEstudiante).not.toBeNull();
    
    const stored = await repository.findOne({ where: { id: savedEstudiante.id } });
    expect(stored).not.toBeNull();
  });

  it('crearEstudiante should throw an error if promedio or semestre do not meet the criteria', async () => {
    const estudiante: EstudianteEntity = {
      id: '',
      nombre: faker.person.fullName(),
      cedula: faker.number.int(),
      semestre: 2,
      programa: faker.word.words(2),
      promedio: 2.5,
      proyectos: [],
    };

    await expect(() => service.crearEstudiante(estudiante)).rejects.toThrow(BadRequestException);
  });

  it('eliminarEstudiante should remove an existing estudiante', async () => {
    const estudiante = estudiantesList[0];
    await service.eliminarEstudiante(estudiante.id);

    const result = await repository.findOne({ where: { id: estudiante.id } });
    expect(result).toBeNull();
  });

  it('eliminarEstudiante should throw an error if estudiante not found', async () => {
    await expect(() => service.eliminarEstudiante('invalid-id')).rejects.toThrow(BadRequestException);
  });
});
