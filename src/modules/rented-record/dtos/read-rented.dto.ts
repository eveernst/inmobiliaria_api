import { Expose, Type } from 'class-transformer';
import { ReadPropertySummaryDto } from 'src/modules/property/dtos/read-property-summary.dto';

export class ReadRentedDto {
  @Expose()
  id: number;

  // datos del propietario
  @Expose()
  ownerDetails: string;

  @Expose()
  affectation: string;

  @Expose()
  ownerContact: string;

  // datos del inquilino
  @Expose()
  renterDetails: string;

  @Expose()
  address: string;

  @Expose()
  renterContact: string;

  @Expose()
  locality: string;

  @Expose()
  contratStartDate: Date;

  @Expose()
  contratEndDate: Date;

  @Expose()
  province: string;

  @Expose()
  price: number;

  @Expose()
  adjustmentType: string;

  @Expose()
  contractImage: string;

  @Expose()
  @Type(() => ReadPropertySummaryDto)
  property: ReadPropertySummaryDto;
}
