import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';
import { Insurance } from './entities/insurance.entity';

describe('InsuranceController', () => {
  const fields = {
    id: 4,
    name: 'Seguros SA',
    phone: '3515551234',
    email: 'seguros@example.com',
    insuredProperty: 'Warehouse',
    insuranceARM: true,
    insuranceASE: false,
    team: true,
    content: false,
    values: true,
    insuranceLink: 'https://example.com/policy',
    insuranceImage: 'https://example.com/policy.jpg',
    insuranceDate: new Date('2026-01-01T00:00:00Z'),
    AnualFormLink: 'https://example.com/annual',
    AnualFormImage: 'https://example.com/annual.jpg',
    AnualFormDate: new Date('2026-06-01T00:00:00Z'),
    observations: 'None',
  };
  const entity = Object.assign(new Insurance(), {
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
  let controller: InsuranceController;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    controller = new InsuranceController(
      service as unknown as InsuranceService,
    );
  });

  it('findAll returns only the exposed DTO fields', async () => {
    service.findAll.mockResolvedValue([entity]);

    const response = await controller.findAll();

    expect(response.map((i) => ({ ...i }))).toEqual([expected]);
  });

  it('findOne returns only the exposed DTO fields', async () => {
    service.findOne.mockResolvedValue(entity);

    const response = await controller.findOne(4);

    expect({ ...response.data }).toEqual(expected);
  });

  it('create returns only the exposed DTO fields', async () => {
    service.create.mockResolvedValue(entity);

    const response = await controller.create({} as any);

    expect({ ...response }).toEqual(expected);
  });

  it('update returns only the exposed DTO fields', async () => {
    service.update.mockResolvedValue(entity);

    const response = await controller.update(4, {});

    expect({ ...response }).toEqual(expected);
  });
});
