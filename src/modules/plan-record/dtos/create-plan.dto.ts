import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';

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

  @IsString()
  planImage?: string;

  // plano estructura
  @IsBoolean()
  @IsNotEmpty()
  structurePlan: boolean;

  @IsString()
  structureImage?: string;

  // plano gas
  @IsBoolean()
  @IsNotEmpty()
  gasPlan: boolean;

  @IsString()
  gasImage?: string;

  // plano agua
  @IsBoolean()
  @IsNotEmpty()
  waterPlan: boolean;

  @IsString()
  waterImage?: string;

  // plano luz
  @IsBoolean()
  @IsNotEmpty()
  lightPlan: boolean;

  @IsString()
  lightImage?: string;

  // ante proyecto
  @IsBoolean()
  @IsNotEmpty()
  projectPlan: boolean;

  @IsString()
  projectImage?: string;

  // final de obra
  @IsBoolean()
  @IsNotEmpty()
  finalPlan: boolean;

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
  @IsDate()
  @IsNotEmpty()
  @IsRequired()
  dateVisado: Date;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  numberVisado: number;

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

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  propertyId: number;
}
