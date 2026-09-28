import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';

describe('NotificationController', () => {
  const entity = Object.assign(new Notification(), {
    id: 7,
    message: 'Insurance expires in 7 days',
    type: 'due-date',
    date: new Date('2026-10-05T00:00:00Z'),
    createdAt: new Date('2026-09-28T00:00:00Z'),
    updatedAt: new Date('2026-09-28T00:00:00Z'),
    user: { id: 1, password: 'hashed-secret' },
  });
  const expected = {
    id: 7,
    message: 'Insurance expires in 7 days',
    type: 'due-date',
    date: new Date('2026-10-05T00:00:00Z'),
  };

  let service: { findAll: jest.Mock; findOne: jest.Mock };
  let controller: NotificationController;

  beforeEach(() => {
    service = { findAll: jest.fn(), findOne: jest.fn() };
    controller = new NotificationController(
      service as unknown as NotificationService,
    );
  });

  it('findOne returns only the exposed DTO fields', async () => {
    service.findOne.mockResolvedValue(entity);

    const response = await controller.findOne(7);

    expect({ ...response.data }).toEqual(expected);
  });

  it('findAll returns only the exposed DTO fields', async () => {
    service.findAll.mockResolvedValue([entity]);

    const response = await controller.findAll();

    expect(response.map((n) => ({ ...n }))).toEqual([expected]);
  });
});
