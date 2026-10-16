import { RentedController } from './rented.controller';
import { RentedService } from './rented.service';
import { Rented } from './entities/rented.entity';

describe('RentedController', () => {
  const fields = {
    id: 6,
    ownerDetails: 'Owner SA',
    affectation: 'Commercial',
    ownerContact: '3515550001',
    renterDetails: 'Renter SRL',
    address: 'Av. Colon 1234',
    renterContact: '3515550002',
    locality: 'Cordoba',
    contratStartDate: new Date('2026-01-01T00:00:00Z'),
    contratEndDate: new Date('2027-01-01T00:00:00Z'),
    province: 'Cordoba',
    price: 150000,
    adjustmentType: 'Annual',
    contractImage: 'https://example.com/contract.jpg',
  };
  const entity = Object.assign(new Rented(), {
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
  let controller: RentedController;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    controller = new RentedController(service as unknown as RentedService);
  });

  it('findAll returns only the exposed DTO fields', async () => {
    service.findAll.mockResolvedValue([entity]);

    const response = await controller.findAll();

    expect(response.map((r) => ({ ...r }))).toEqual([expected]);
  });

  it('findOne returns only the exposed DTO fields', async () => {
    service.findOne.mockResolvedValue(entity);

    const response = await controller.findOne(6);

    expect({ ...response.data }).toEqual(expected);
  });

  it('create returns only the exposed DTO fields', async () => {
    service.create.mockResolvedValue(entity);

    const response = await controller.create({} as any);

    expect({ ...response }).toEqual(expected);
  });

  it('update returns only the exposed DTO fields', async () => {
    service.update.mockResolvedValue(entity);

    const response = await controller.update(6, {});

    expect({ ...response }).toEqual(expected);
  });
});
