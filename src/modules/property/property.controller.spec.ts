import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property } from './entities/property.entity';

describe('PropertyController', () => {
  const fields = {
    id: 1,
    goodUseCode: 1234567,
    file: 'https://example.com/property.jpg',
    province: 'Cordoba',
    locality: 'Cordoba',
    address: 'Av. Colon 1234',
    postalCode: 5000,
    betweenStreets1: 'Calle A',
    betweenStreets2: 'Calle B',
    district: 'Centro',
    destiny: 5,
    state: 1,
    active: true,
    clfc: '1',
    detailsMaintenance: 'None',
    description: 'A property',
  };
  const timestamps = {
    createdAt: new Date('2026-09-28T00:00:00Z'),
    updatedAt: new Date('2026-09-28T00:00:00Z'),
  };
  const classification = { id: 3, name: 'Residential', ...timestamps };
  const entity = Object.assign(new Property(), {
    ...fields,
    ...timestamps,
    user: { id: 1, password: 'hashed-secret' },
    classification,
    installations: [
      {
        id: 9,
        name: 'Gas',
        quantity: 2,
        file: '',
        details: 'Boiler',
        classification,
        ...timestamps,
      },
    ],
    insurances: [],
    plans: [],
    renteds: [],
    writings: [],
  });

  const request = { user: { id: 1 } } as any;

  let service: { create: jest.Mock; update: jest.Mock };
  let controller: PropertyController;

  beforeEach(() => {
    service = { create: jest.fn(), update: jest.fn() };
    controller = new PropertyController(service as unknown as PropertyService);
  });

  it('create returns only the exposed DTO fields', async () => {
    service.create.mockResolvedValue(entity);

    const response = await controller.create({} as any, request);

    expect({ ...response.data }).toEqual({
      ...fields,
      classification: { id: 3, name: 'Residential' },
    });
  });

  it('update returns only the exposed DTO fields', async () => {
    service.update.mockResolvedValue(entity);

    const response = await controller.update(1, {});

    expect({ ...response }).toEqual({
      ...fields,
      classification: { id: 3, name: 'Residential' },
      installations: [
        {
          id: 9,
          name: 'Gas',
          quantity: 2,
          file: '',
          details: 'Boiler',
          classification: { id: 3, name: 'Residential' },
        },
      ],
      insurances: [],
      plans: [],
      renteds: [],
      writings: [],
    });
  });
});
