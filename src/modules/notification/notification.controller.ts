import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { Notification } from "./entities/notification.entity";
import { CreateNotificationDto } from "./dtos/create-notification.dto";
import { GenericResponse } from "src/shared/generic-response.dto";
import { plainToClass } from "class-transformer";
import { ReadNotificationDto } from "./dtos/read-notification.dto";

@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<GenericResponse<ReadNotificationDto>> {
    const notification = await this.notificationService.findOne(id);
    const response = plainToClass(ReadNotificationDto, notification);
    return new GenericResponse<ReadNotificationDto>(response);
  }

  @Post()
  async create(@Body() notificationData: CreateNotificationDto): Promise<GenericResponse<ReadNotificationDto>> {
    const notification = await this.notificationService.create(notificationData);
    const response = plainToClass(ReadNotificationDto, notification);
    return new GenericResponse<ReadNotificationDto>(response);
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() notificationData: Partial<Notification>): Promise<Notification> {
    return this.notificationService.update(id, notificationData);
  }

  @Delete(":id")
  remove(@Param("id") id: number): Promise<void> {
    return this.notificationService.remove(id);
  }
}