import { Expose } from 'class-transformer';

export class ReadPropertySummaryDto {
  @Expose()
  id: number;

  @Expose()
  address: string;

  @Expose()
  locality: string;

  @Expose()
  province: string;
}
