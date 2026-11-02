import { ClassificationController } from './classification.controller';
import { ClassificationService } from './classification.service';
import { Classification } from './entities/classification.entity';

describe('ClassificationController', () => {
  const entity = Object.assign(new Classification(), {
    id: 3,
    name: 'Residential',
    createdAt: new Date('2026-09-28T00:00:00Z'),
    updatedAt: new Date('2026-09-28T00:00:00Z'),
    properties: [{ id: 1, user: { id: 1, password: 'hashed-secret' } }],
  });
  const expected = { id: 3, name: 'Residential' };

  let service: { findAll: jest.Mock; findOne: jest.Mock; update: jest.Mock };
  let controller: ClassificationController;

  beforeEach(() => {
    service = { findAll: jest.fn(), findOne: jest.fn(), update: jest.fn() };
    controller = new ClassificationController(
      service as unknown as ClassificationService,
    );
  });

  it('findAll returns only the exposed DTO fields', async () => {
    service.findAll.mockResolvedValue([entity]);

    const response = await controller.findAll();

    expect(response.map((c) => ({ ...c }))).toEqual([expected]);
  });

  it('findOne returns only the exposed DTO fields', async () => {
    service.findOne.mockResolvedValue(entity);

    const response = await controller.findOne(3);

    expect({ ...response.data }).toEqual(expected);
  });

  it('update returns only the exposed DTO fields', async () => {
    service.update.mockResolvedValue(entity);

    const response = await controller.update(3, { name: 'Residential' });

    expect({ ...response }).toEqual(expected);
  });
});
