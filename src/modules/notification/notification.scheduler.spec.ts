import { Logger } from '@nestjs/common';
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

  describe('catch-up window (issue #25)', () => {
    const rentedEndingOn = (id: number, isoDate: string) =>
      ({
        id,
        contratEndDate: new Date(isoDate),
        property: { id: 11 },
      }) as Rented;

    it('notifies a contract ending in 3 days that was never notified, with the real days left', async () => {
      const rented = rentedEndingOn(22, '2026-10-01T00:00:00.000Z');
      rentedRepository.find.mockResolvedValue([rented]);

      await scheduler.createDueDateNotifications();

      expect(
        notificationService.createDueDateNotification,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceId: 22,
          dueDate: rented.contratEndDate,
          message: 'Vence el contrato de alquiler en 3 días',
        }),
      );
    });

    it.each([
      ['2026-09-29T00:00:00.000Z', 'Vence el contrato de alquiler mañana'],
      ['2026-09-28T00:00:00.000Z', 'Vence el contrato de alquiler hoy'],
    ])('words a contract ending on %s as "%s"', async (isoDate, message) => {
      rentedRepository.find.mockResolvedValue([rentedEndingOn(22, isoDate)]);

      await scheduler.createDueDateNotifications();

      expect(
        notificationService.createDueDateNotification,
      ).toHaveBeenCalledWith(expect.objectContaining({ message }));
    });

    it.each([
      ['more than 7 days away', '2026-10-06T00:00:00.000Z'],
      ['already past', '2026-09-27T00:00:00.000Z'],
    ])('skips a contract ending %s', async (_label, isoDate) => {
      rentedRepository.find.mockResolvedValue([rentedEndingOn(22, isoDate)]);

      await scheduler.createDueDateNotifications();

      expect(
        notificationService.createDueDateNotification,
      ).not.toHaveBeenCalled();
    });

    it('notifies both insurance dates inside the window', async () => {
      insuranceRepository.find.mockResolvedValue([
        {
          id: 5,
          insuranceDate: new Date('2026-10-02T00:00:00.000Z'),
          AnualFormDate: new Date('2026-09-30T00:00:00.000Z'),
          property: { id: 11 },
        } as Insurance,
      ]);
      rentedRepository.find.mockResolvedValue([]);

      await scheduler.createDueDateNotifications();

      expect(
        notificationService.createDueDateNotification,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceType: 'insurance-date',
          message: 'Vence el seguro del inmueble en 4 días',
        }),
      );
      expect(
        notificationService.createDueDateNotification,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceType: 'insurance-annual-date',
          message: 'Vence el formulario anual del seguro en 2 días',
        }),
      );
    });
  });

  describe('per-record error handling (issue #25)', () => {
    it('keeps notifying the other records when one fails', async () => {
      const logError = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation(() => undefined);
      const broken = {
        id: 1,
        contratEndDate: new Date('2026-10-01T00:00:00.000Z'),
        property: null,
      } as unknown as Rented;
      const healthy = {
        id: 2,
        contratEndDate: new Date('2026-10-01T00:00:00.000Z'),
        property: { id: 11 },
      } as Rented;
      rentedRepository.find.mockResolvedValue([broken, healthy]);
      notificationService.createDueDateNotification.mockImplementation(
        async (data) => {
          if (!data.property) {
            throw new TypeError(
              "Cannot read properties of null (reading 'user')",
            );
          }
          return [];
        },
      );

      await expect(scheduler.createDueDateNotifications()).resolves.toBe(
        undefined,
      );

      expect(
        notificationService.createDueDateNotification,
      ).toHaveBeenCalledWith(expect.objectContaining({ sourceId: 2 }));
      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining('rented-contract 1'),
        expect.any(String),
      );

      logError.mockRestore();
      notificationService.createDueDateNotification.mockReset();
    });
  });
});
