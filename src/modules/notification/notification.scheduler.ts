import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insurance } from '../insurance-record/entities/insurance.entity';
import { Rented } from '../rented-record/entities/rented.entity';
import { Property } from '../property/entities/property.entity';
import { NotificationService } from './notification.service';

const NOTICE_WINDOW_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

interface DueDate {
  sourceType: string;
  sourceId: number;
  dueDate: Date | undefined;
  property: Property;
  subject: string;
}

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(
    @InjectRepository(Insurance)
    private readonly insuranceRepository: Repository<Insurance>,
    @InjectRepository(Rented)
    private readonly rentedRepository: Repository<Rented>,
    private readonly notificationService: NotificationService,
  ) {}

  // Notifies every due date from today up to NOTICE_WINDOW_DAYS ahead, not
  // only the exact 7th day, so a run missed while the app was down is caught
  // up the next day. Running daily over the same window is safe: the service
  // skips due dates already notified, and the unique index backs it up.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createDueDateNotifications(): Promise<void> {
    const today = this.startOfUtcDay(new Date());

    const [insurances, renteds] = await Promise.all([
      this.insuranceRepository.find({
        relations: ['property', 'property.user'],
      }),
      this.rentedRepository.find({
        relations: ['property', 'property.user'],
      }),
    ]);

    const dueDates: DueDate[] = [
      ...insurances.flatMap((insurance) => [
        {
          sourceType: 'insurance-date',
          sourceId: insurance.id,
          dueDate: insurance.insuranceDate,
          property: insurance.property,
          subject: 'el seguro del inmueble',
        },
        {
          sourceType: 'insurance-annual-date',
          sourceId: insurance.id,
          dueDate: insurance.AnualFormDate,
          property: insurance.property,
          subject: 'el formulario anual del seguro',
        },
      ]),
      ...renteds.map((rented) => ({
        sourceType: 'rented-contract',
        sourceId: rented.id,
        dueDate: rented.contratEndDate,
        property: rented.property,
        subject: 'el contrato de alquiler',
      })),
    ];

    for (const due of dueDates) {
      // One bad record must not cancel the notices for the rest of the day.
      try {
        await this.notifyIfDueSoon(due, today);
      } catch (error) {
        this.logger.error(
          `Failed to create due-date notification for ${due.sourceType} ${due.sourceId}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }
  }

  private async notifyIfDueSoon(due: DueDate, today: Date): Promise<void> {
    if (!due.dueDate) {
      return;
    }

    const daysLeft = Math.round(
      (this.startOfUtcDay(new Date(due.dueDate)).getTime() - today.getTime()) /
        DAY_MS,
    );

    if (daysLeft < 0 || daysLeft > NOTICE_WINDOW_DAYS) {
      return;
    }

    await this.notificationService.createDueDateNotification({
      sourceType: due.sourceType,
      sourceId: due.sourceId,
      dueDate: due.dueDate,
      property: due.property,
      message: `Vence ${due.subject} ${this.whenLabel(daysLeft)}`,
    });
  }

  // The message is stored once per due date (deduplication), so it states
  // the days left when it was first created.
  private whenLabel(daysLeft: number): string {
    if (daysLeft === 0) {
      return 'hoy';
    }
    if (daysLeft === 1) {
      return 'mañana';
    }
    return `en ${daysLeft} días`;
  }

  private startOfUtcDay(date: Date): Date {
    const result = new Date(date);
    result.setUTCHours(0, 0, 0, 0);
    return result;
  }
}
