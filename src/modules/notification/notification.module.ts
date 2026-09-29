import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { User } from '../users/entities/user.entity';
import { Property } from '../property/entities/property.entity';
import { Insurance } from '../insurance-record/entities/insurance.entity';
import { Rented } from '../rented-record/entities/rented.entity';
import { NotificationScheduler } from './notification.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Property, Insurance, Rented]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationScheduler],
  exports: [NotificationService],
})
export class NotificationModule {}
