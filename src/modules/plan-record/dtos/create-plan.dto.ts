import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';
import { IsCalendarDate } from 'src/shared/decorators/is-calendar-date.decorator';

export class CreatePlanDto {
  // plano general
  @IsBoolean()
  @IsNotEmpty()
  generalPlan: boolean;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  planNumber: number;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  year: number;

  @IsOptional()
  @IsString()
  planImage?: string;

  // plano estructura
  @IsBoolean()
  @IsNotEmpty()
  structurePlan: boolean;

  @IsOptional()
  @IsString()
  structureImage?: string;

  // plano gas
  @IsBoolean()
  @IsNotEmpty()
  gasPlan: boolean;

  @IsOptional()
  @IsString()
  gasImage?: string;

  // plano agua
  @IsBoolean()
  @IsNotEmpty()
  waterPlan: boolean;

  @IsOptional()
  @IsString()
  waterImage?: string;

  // plano luz
  @IsBoolean()
  @IsNotEmpty()
  lightPlan: boolean;

  @IsOptional()
  @IsString()
  lightImage?: string;

  // ante proyecto
  @IsBoolean()
  @IsNotEmpty()
  projectPlan: boolean;

  @IsOptional()
  @IsString()
  projectImage?: string;

  // final de obra
  @IsBoolean()
  @IsNotEmpty()
  finalPlan: boolean;

  @IsOptional()
  @IsString()
  finalImage?: string;

  // actualizacion
  @IsString()
  @IsNotEmpty()
  @IsRequired()
  planType: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  planNumberUpdate: number;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  yearUpdate: number;

  @IsOptional()
  @IsString()
  stateImage?: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  professional: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  professionalContact: string;

  // visado municipal
  @IsCalendarDate()
  @IsRequired()
  dateVisado: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  numberVisado: number;

  @IsOptional()
  @IsString()
  imageVisado?: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  formalities: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  documentation: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  contacts: string;

  @IsInt()
  @IsRequired()
  propertyId: number;
}
