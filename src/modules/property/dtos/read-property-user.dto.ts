import { Expose } from 'class-transformer';

export class ReadPropertyUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
