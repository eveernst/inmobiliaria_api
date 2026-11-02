import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PROVINCES } from 'src/shared/constants/provinces';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';
import { IsCalendarDate } from 'src/shared/decorators/is-calendar-date.decorator';

export class CreateRentedDto {
  // Text fields the form treats as optional arrive as ''. The columns are
  // NOT NULL, so '' is accepted and stored; omitting the field is rejected.

  // datos del propietario
  @IsString()
  ownerDetails: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  affectation: string;

  @IsString()
  ownerContact: string;

  // datos del inquilino
  @IsString()
  renterDetails: string;

  @IsString()
  address: string;

  @IsString()
  renterContact: string;

  @IsString()
  locality: string;

  @IsCalendarDate()
  @IsRequired()
  contratStartDate: string;

  @IsCalendarDate()
  @IsRequired()
  contratEndDate: string;

  // Same list as properties (requirement 14, issues #24 and #49).
  @IsIn(PROVINCES)
  @IsRequired()
  province: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  price: number;

  @IsString()
  adjustmentType: string;

  @IsOptional()
  @IsString()
  contractImage?: string;

  @IsInt()
  @IsRequired()
  propertyId: number;
}
