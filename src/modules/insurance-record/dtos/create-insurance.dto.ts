import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';
import { IsCalendarDate } from 'src/shared/decorators/is-calendar-date.decorator';

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

  @IsCalendarDate()
  @IsRequired()
  insuranceDate: string;

  // formulario anual
  @IsOptional()
  @IsString()
  AnualFormLink?: string;

  @IsOptional()
  @IsString()
  AnualFormImage?: string;

  @IsCalendarDate()
  @IsRequired()
  AnualFormDate: string;

  // Text fields the form treats as optional arrive as ''. The columns are
  // NOT NULL, so '' is accepted and stored; omitting the field is rejected.
  @IsString()
  observations: string;

  @IsInt()
  @IsRequired()
  propertyId: number;
}
