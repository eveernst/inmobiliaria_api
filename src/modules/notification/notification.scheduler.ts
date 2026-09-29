import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insurance } from '../insurance-record/entities/insurance.entity';
import { Rented } from '../rented-record/entities/rented.entity';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
  constructor(
    @InjectRepository(Insurance)
    private readonly insuranceRepository: Repository<Insurance>,
    @InjectRepository(Rented)
    private readonly rentedRepository: Repository<Rented>,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createDueDateNotifications(): Promise<void> {
    const targetDate = this.addDays(new Date(), 7);

    const [insurances, renteds] = await Promise.all([
      this.insuranceRepository.find({
        relations: ['property', 'property.user'],
      }),
      this.rentedRepository.find({
        relations: ['property', 'property.user'],
      }),
    ]);

    for (const insurance of insurances) {
      await this.notifyInsuranceDate(
        insurance,
        insurance.insuranceDate,
        targetDate,
        'Vence el seguro del inmueble en 7 días',
        'insurance-date',
      );
      await this.notifyInsuranceDate(
        insurance,
        insurance.AnualFormDate,
        targetDate,
        'Vence el formulario anual del seguro en 7 días',
        'insurance-annual-date',
      );
    }

    for (const rented of renteds) {
      if (this.isSameDay(rented.contratEndDate, targetDate)) {
        await this.notificationService.createDueDateNotification({
          sourceType: 'rented-contract',
          sourceId: rented.id,
          dueDate: rented.contratEndDate,
          property: rented.property,
          message: 'Vence el contrato de alquiler en 7 días',
        });
      }
    }
  }

  private async notifyInsuranceDate(
    insurance: Insurance,
    dueDate: Date | undefined,
    targetDate: Date,
    message: string,
    sourceType: string,
  ): Promise<void> {
    if (!dueDate || !this.isSameDay(dueDate, targetDate)) {
      return;
    }

    await this.notificationService.createDueDateNotification({
      sourceType,
      sourceId: insurance.id,
      dueDate,
      property: insurance.property,
      message,
    });
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setUTCHours(0, 0, 0, 0);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  }

  private isSameDay(firstDate: Date | undefined, secondDate: Date): boolean {
    if (!firstDate) {
      return false;
    }

    const date = new Date(firstDate);
    return (
      date.getUTCFullYear() === secondDate.getUTCFullYear() &&
      date.getUTCMonth() === secondDate.getUTCMonth() &&
      date.getUTCDate() === secondDate.getUTCDate()
    );
  }
}
