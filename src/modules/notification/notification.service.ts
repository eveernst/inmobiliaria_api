import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Property } from '../property/entities/property.entity';
import { UserRole } from 'src/shared/enums/user-role.enum';

type NotificationResource = 'property' | 'installation';

interface DueDateNotificationData {
  sourceType: string;
  sourceId: number;
  dueDate: Date;
  property: Property;
  message: string;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
    });
  }

  // Scoped to the owner: another user's notification is indistinguishable
  // from a missing one, so ids don't leak across users.
  findOne(id: number, userId: number): Promise<Notification | null> {
    return this.notificationRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  async createRegistrationNotification(
    userId: number,
    resource: NotificationResource,
    resourceId: number,
    property?: Property,
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error(`User ${userId} not found for notification`);
    }

    const notification = this.notificationRepository.create({
      message: `${resource} registrado correctamente`,
      type: 'registration-success',
      date: new Date(),
      sourceType: resource,
      sourceId: resourceId,
      property,
      user,
    });

    return this.notificationRepository.save(notification);
  }

  async createDueDateNotification(
    data: DueDateNotificationData,
  ): Promise<Notification[]> {
    const recipients = await this.getRecipients(data.property);
    const notifications: Notification[] = [];

    for (const user of recipients) {
      const existing = await this.notificationRepository.findOne({
        where: {
          type: 'due-date',
          sourceType: data.sourceType,
          sourceId: data.sourceId,
          dueDate: data.dueDate,
          user: { id: user.id },
        },
      });

      if (existing) {
        continue;
      }

      try {
        notifications.push(
          await this.notificationRepository.save(
            this.notificationRepository.create({
              message: data.message,
              type: 'due-date',
              date: new Date(),
              sourceType: data.sourceType,
              sourceId: data.sourceId,
              dueDate: data.dueDate,
              property: data.property,
              user,
            }),
          ),
        );
      } catch (error) {
        if (
          !(error instanceof QueryFailedError) ||
          error.driverError?.code !== '23505'
        ) {
          throw error;
        }
      }
    }

    return notifications;
  }

  private async getRecipients(property: Property): Promise<User[]> {
    if (property.user) {
      return [property.user];
    }

    return this.userRepository.find({ where: { role: UserRole.ADMIN } });
  }
}
