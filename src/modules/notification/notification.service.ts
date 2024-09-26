import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./entities/notification.entity";
import { CreateNotificationDto } from "./dtos/create-notification.dto";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  findOne(id: number): Promise<Notification> {
    return this.notificationRepository.findOne({ where: { id } });
  }

  async create(notificationData: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(notificationData);
    return await this.notificationRepository.save(notification);
  }

  async update(id: number, notificationData: Partial<Notification>): Promise<Notification> {
    await this.notificationRepository.update(id, notificationData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.notificationRepository.delete(id);
  }
}