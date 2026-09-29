import { Repository } from 'typeorm';
import { Insurance } from '../insurance-record/entities/insurance.entity';
import { Rented } from '../rented-record/entities/rented.entity';
import { NotificationScheduler } from './notification.scheduler';
import { NotificationService } from './notification.service';

describe('NotificationScheduler', () => {
  const insuranceRepository = {
    find: jest.fn(),
  } as unknown as jest.Mocked<Repository<Insurance>>;
  const rentedRepository = {
    find: jest.fn(),
  } as unknown as jest.Mocked<Repository<Rented>>;
  const notificationService = {
    createDueDateNotification: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;
  const scheduler = new NotificationScheduler(
    insuranceRepository,
    rentedRepository,
    notificationService,
  );

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-28T10:00:00.000Z'));
    jest.clearAllMocks();
    insuranceRepository.find.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('notifies about a rental contract ending in seven days', async () => {
    const rented = {
      id: 22,
      contratEndDate: new Date('2026-10-05T00:00:00.000Z'),
      property: { id: 11 },
    } as Rented;
    rentedRepository.find.mockResolvedValue([rented]);

    await scheduler.createDueDateNotifications();

    expect(notificationService.createDueDateNotification).toHaveBeenCalledWith({
      sourceType: 'rented-contract',
      sourceId: 22,
      dueDate: rented.contratEndDate,
      property: rented.property,
      message: 'Vence el contrato de alquiler en 7 días',
    });
  });
});
