import express from 'express';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

// --- PASSO 1: IMPORTAR AS ENTIDADES QUE FALTAVAM ---
import { PropertyEntity } from './../persistence/entities/property_entity';
import { BookingEntity } from '../persistence/entities/booking_entity';
import { UserEntity } from '../persistence/entities/user_entity';
// ---------------------------------------------------

import { TypeORMPropertyRepository } from './../repositories/typeorm_property_repository';
import { PropertyService } from './../../application/services/property_service';
import { PropertyController } from './property_controller';

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );
  propertyService = new PropertyService(propertyRepository);
  propertyController = new PropertyController(propertyService);

  app.post('/properties', (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('PropertyController', () => {
  beforeEach(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);
    await propertyRepo.clear();
  });

  it('deve criar uma propriedade com sucesso', async () => {
    const propertyPayload = {
      name: 'Casa à venda',
      description: 'Linda casa com 3 quartos',
      maxGuests: 5,
      basePricePerNight: 300000,
    };

    const response = await request(app)
      .post('/properties')
      .send(propertyPayload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Propriedade criada com sucesso.');
    expect(response.body.property).toHaveProperty('id');
    expect(response.body.property.name).toBe('Casa à venda');
  });

  it("deve retornar erro com código 400 e mensagem 'O nome é obrigatório' ao enviar um nome vazio", async () => {
    const propertyPayload = {
      name: '',
      description: 'Descrição da propriedade',
      maxGuests: 5,
      basePricePerNight: 200000,
    };

    const response = await request(app)
      .post('/properties')
      .send(propertyPayload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('O nome é obrigatório');
  });

  it("deve retornar erro com código 400 e mensagem 'O número máximo de hóspedes deve ser maior que zero' ao enviar maxGuests igual a zero ou negativo", async () => {
    const propertyPayload = {
      name: 'Casa à venda',
      description: 'Linda casa com 3 quartos',
      maxGuests: 0,
      basePricePerNight: 300000,
    };

    const response = await request(app)
      .post('/properties')
      .send(propertyPayload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'O número máximo de hóspedes deve ser maior que zero'
    );
  });

  it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const propertyPayload = {
      name: 'Casa à venda',
      description: 'Linda casa com 3 quartos',
      maxGuests: 5,
    };

    const response = await request(app)
      .post('/properties')
      .send(propertyPayload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('O preço base por noite é obrigatório.');
  });
});
