import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';

export class CreateInstallationDto {
  @IsString()
  @IsNotEmpty()
  @IsRequired()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsRequired()
  quantity: number;

  @IsOptional()
  @IsString()
  file?: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  details: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  propertyId: number;
}
