import { NotFoundException } from '@nestjs/common';
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

  const request = { user: { id: 1 } } as any;

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

    const response = await controller.findOne(7, request);

    expect({ ...response.data }).toEqual(expected);
  });

  it('findAll returns only the exposed DTO fields', async () => {
    service.findAll.mockResolvedValue([entity]);

    const response = await controller.findAll(request);

    expect(response.map((n) => ({ ...n }))).toEqual([expected]);
  });

  it('findAll only asks for the caller notifications', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.findAll(request);

    expect(service.findAll).toHaveBeenCalledWith(1);
  });

  it('findOne looks the notification up scoped to the caller', async () => {
    service.findOne.mockResolvedValue(entity);

    await controller.findOne(7, request);

    expect(service.findOne).toHaveBeenCalledWith(7, 1);
  });

  it('findOne returns 404 when the notification belongs to another user', async () => {
    service.findOne.mockResolvedValue(null);

    await expect(controller.findOne(7, request)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
