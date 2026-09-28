import { Expose } from 'class-transformer';

export class ReadNotificationDto {
  @Expose()
  id: number;

  @Expose()
  message: string;

  @Expose()
  type: string;

  @Expose()
  date: Date;
}
