import { Expose } from 'class-transformer';

export class ReadUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: number;
}
