import { InstallationController } from './installation.controller';
import { InstallationService } from './installation.service';
import { Installation } from './entities/installation.entity';

describe('InstallationController', () => {
  const timestamps = {
    createdAt: new Date('2026-09-28T00:00:00Z'),
    updatedAt: new Date('2026-09-28T00:00:00Z'),
  };
  const entity = Object.assign(new Installation(), {
    id: 9,
    name: 'Gas',
    quantity: 2,
    file: '',
    details: 'Boiler',
    ...timestamps,
    property: {
      id: 3,
      address: 'Av. Colón 1234',
      locality: 'Córdoba',
      province: 'Córdoba',
      ...timestamps,
      user: { id: 1, password: 'hashed-secret' },
    },
  });
  const expected = {
    id: 9,
    name: 'Gas',
    quantity: 2,
    file: '',
    details: 'Boiler',
    property: {
      id: 3,
      address: 'Av. Colón 1234',
      locality: 'Córdoba',
      province: 'Córdoba',
    },
  };

  const request = { user: { id: 1 } } as any;

  let service: { create: jest.Mock; update: jest.Mock };
  let controller: InstallationController;

  beforeEach(() => {
    service = { create: jest.fn(), update: jest.fn() };
    controller = new InstallationController(
      service as unknown as InstallationService,
    );
  });

  it('create returns only the exposed DTO fields', async () => {
    service.create.mockResolvedValue(entity);

    const response = await controller.create({} as any, request);

    expect(JSON.parse(JSON.stringify(response.data))).toEqual(
      JSON.parse(JSON.stringify(expected)),
    );
  });

  it('update returns only the exposed DTO fields', async () => {
    service.update.mockResolvedValue(entity);

    const response = await controller.update(9, { quantity: 2 });

    expect(JSON.parse(JSON.stringify(response))).toEqual(
      JSON.parse(JSON.stringify(expected)),
    );
  });
});
