import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';

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

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsRequired()
  contratStartDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsRequired()
  contratEndDate: Date;

  @IsString()
  @IsNotEmpty()
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
