import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToInstance } from 'class-transformer';
import { ReadNotificationDto } from './dtos/read-notification.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

// Notifications are system-generated (see issue #7), so there are no
// create/update/delete endpoints here.
@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(): Promise<ReadNotificationDto[]> {
    const notifications = await this.notificationService.findAll();
    return plainToInstance(ReadNotificationDto, notifications, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<GenericResponse<ReadNotificationDto>> {
    const notification = await this.notificationService.findOne(id);
    const response = plainToInstance(ReadNotificationDto, notification, {
      excludeExtraneousValues: true,
    });
    return new GenericResponse<ReadNotificationDto>(response);
  }
}
