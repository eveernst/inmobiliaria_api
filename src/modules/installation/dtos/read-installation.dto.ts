import { Expose, Type } from 'class-transformer';
import { ReadPropertySummaryDto } from 'src/modules/property/dtos/read-property-summary.dto';

export class ReadInstallationDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  file?: string;

  @Expose()
  details: string;

  @Expose()
  @Type(() => ReadPropertySummaryDto)
  property: ReadPropertySummaryDto;
}
