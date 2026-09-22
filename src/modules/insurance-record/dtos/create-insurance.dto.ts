import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';

export class CreateInsuranceDto {
  // responsable del seguro ARM
  @IsString()
  @IsNotEmpty()
  @IsRequired()
  name: string;

  @IsString()
  @Matches(/^\d{10}$/)
  @IsNotEmpty()
  @IsRequired()
  phone: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsRequired()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  insuredProperty: string;

  // tipo de seguro q se registra
  // responsabilidad civil
  @IsBoolean()
  @IsNotEmpty()
  @IsRequired()
  insuranceARM: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @IsRequired()
  insuranceASE: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @IsRequired()
  team: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @IsRequired()
  content: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @IsRequired()
  values: boolean;

  // formulario del seguro
  @IsOptional()
  @IsString()
  insuranceLink?: string;

  @IsOptional()
  @IsString()
  insuranceImage?: string;

  @IsOptional()
  @IsString()
  insuranceDate?: string;

  // formulario anual
  @IsOptional()
  @IsString()
  AnualFormLink?: string;

  @IsOptional()
  @IsString()
  AnualFormImage?: string;

  @IsOptional()
  @IsString()
  AnualFormDate?: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  observations: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  propertyId: number;
}
