import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { Plan } from './entities/plan.entity';

describe('PlanController', () => {
  const fields = {
    id: 5,
    generalPlan: true,
    planNumber: 12,
    year: 2020,
    planImage: 'https://example.com/plan.jpg',
    structurePlan: true,
    structureImage: 'https://example.com/structure.jpg',
    gasPlan: false,
    gasImage: 'https://example.com/gas.jpg',
    waterPlan: true,
    waterImage: 'https://example.com/water.jpg',
    lightPlan: false,
    lightImage: 'https://example.com/light.jpg',
    projectPlan: true,
    projectImage: 'https://example.com/project.jpg',
    finalPlan: false,
    finalImage: 'https://example.com/final.jpg',
    planType: 'Final',
    planNumberUpdate: 3,
    yearUpdate: 2022,
    stateImage: 'https://example.com/state.jpg',
    professional: 'Ing. Perez',
    professionalContact: '3515551234',
    dateVisado: new Date('2020-05-01T00:00:00Z'),
    numberVisado: 99,
    imageVisado: 'https://example.com/visado.jpg',
    formalities: 'Done',
    documentation: 'Complete',
    contacts: 'Ing. Perez',
  };
  const entity = Object.assign(new Plan(), {
    ...fields,
    createdAt: new Date('2026-09-28T00:00:00Z'),
    updatedAt: new Date('2026-09-28T00:00:00Z'),
    property: {
      id: 1,
      address: 'Av. Colon 1234',
      locality: 'Cordoba',
      province: 'Cordoba',
      user: { id: 1, password: 'hashed-secret' },
    },
  });
  const expected = {
    ...fields,
    property: {
      id: 1,
      address: 'Av. Colon 1234',
      locality: 'Cordoba',
      province: 'Cordoba',
    },
  };

  let service: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  let controller: PlanController;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    controller = new PlanController(service as unknown as PlanService);
  });

  it('findAll returns only the exposed DTO fields', async () => {
    service.findAll.mockResolvedValue([entity]);

    const response = await controller.findAll();

    expect(response.map((p) => ({ ...p }))).toEqual([expected]);
  });

  it('findOne returns only the exposed DTO fields', async () => {
    service.findOne.mockResolvedValue(entity);

    const response = await controller.findOne(5);

    expect({ ...response.data }).toEqual(expected);
  });

  it('create returns only the exposed DTO fields', async () => {
    service.create.mockResolvedValue(entity);

    const response = await controller.create({} as any);

    expect({ ...response }).toEqual(expected);
  });

  it('update returns only the exposed DTO fields', async () => {
    service.update.mockResolvedValue(entity);

    const response = await controller.update(5, {});

    expect({ ...response }).toEqual(expected);
  });
});
