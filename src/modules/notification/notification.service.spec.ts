import { Repository } from 'typeorm';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Property } from '../property/entities/property.entity';

describe('NotificationService', () => {
  const notificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  } as unknown as jest.Mocked<Repository<Notification>>;
  const userRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  } as unknown as jest.Mocked<Repository<User>>;
  const service = new NotificationService(
    notificationRepository,
    userRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a registration notification for the acting user', async () => {
    const user = { id: 7 } as User;
    const property = { id: 11 } as Property;
    const notification = { id: 1 } as Notification;
    userRepository.findOne.mockResolvedValue(user);
    notificationRepository.create.mockReturnValue(notification);
    notificationRepository.save.mockResolvedValue(notification);

    await expect(
      service.createRegistrationNotification(7, 'property', 11, property),
    ).resolves.toBe(notification);

    expect(notificationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'registration-success',
        sourceType: 'property',
        sourceId: 11,
        property,
        user,
      }),
    );
  });

  it('does not duplicate a due-date notification', async () => {
    const property = { id: 11, user: { id: 7 } } as Property;
    const dueDate = new Date('2026-10-01T00:00:00.000Z');
    notificationRepository.findOne.mockResolvedValue({ id: 1 } as Notification);

    await expect(
      service.createDueDateNotification({
        sourceType: 'rented-contract',
        sourceId: 22,
        dueDate,
        property,
        message: 'Vence el contrato en 7 días',
      }),
    ).resolves.toEqual([]);

    expect(notificationRepository.save).not.toHaveBeenCalled();
  });
});
