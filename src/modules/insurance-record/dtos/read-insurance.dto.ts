import { Expose, Type } from 'class-transformer';
import { ReadPropertySummaryDto } from 'src/modules/property/dtos/read-property-summary.dto';

export class ReadInsuranceDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  insuredProperty: string;

  // tipo de seguro q se registra
  // responsabilidad civil
  @Expose()
  insuranceARM: boolean;

  @Expose()
  insuranceASE: boolean;

  @Expose()
  team: boolean;

  @Expose()
  content: boolean;

  @Expose()
  values: boolean;

  // formulario del seguro
  @Expose()
  insuranceLink?: string;

  @Expose()
  insuranceImage?: string;

  @Expose()
  insuranceDate?: Date;

  // formulario anual
  @Expose()
  AnualFormLink?: string;

  @Expose()
  AnualFormImage?: string;

  @Expose()
  AnualFormDate?: Date;

  @Expose()
  observations: string;

  @Expose()
  @Type(() => ReadPropertySummaryDto)
  property: ReadPropertySummaryDto;
}
