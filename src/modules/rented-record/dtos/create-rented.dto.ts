import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';

export class CreateRentedDto {
  // datos del propietario
  @IsString()
  @IsNotEmpty()
  @IsRequired()
  ownerDetails: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  affectation: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  ownerContact: string;

  // datos del inquilino
  @IsString()
  @IsNotEmpty()
  @IsRequired()
  renterDetails: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  renterContact: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  locality: string;

  @IsDate()
  @IsNotEmpty()
  @IsRequired()
  contratStartDate: Date;

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
  @IsNotEmpty()
  @IsRequired()
  adjustmentType: string;

  @IsString()
  contractImage?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  propertyId: number;
}
