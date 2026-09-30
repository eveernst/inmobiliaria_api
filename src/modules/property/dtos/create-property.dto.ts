import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsRequired } from '../../../shared/decorators/is-required.decorator';
import { ToNumber } from '../../../shared/decorators/to-number.decorator';
import { CreatePropertyInstallationDto } from './create-property-installation.dto';

export class CreatePropertyDto {
  @ToNumber()
  @IsNumber()
  @IsRequired()
  goodUseCode: number;

  // @IsString()
  // @IsRequired()
  // innerImage: string;

  // @IsString()
  // @IsRequired()
  // outerImage: string;

  @IsString()
  @IsRequired()
  province: string;

  @IsString()
  @IsRequired()
  locality: string;

  @IsString()
  @IsRequired()
  address: string;

  @IsNumber()
  @IsRequired()
  postalCode: number;

  @IsString()
  @IsRequired()
  betweenStreets1: string;

  @IsString()
  @IsRequired()
  betweenStreets2: string;

  @IsString()
  @IsRequired()
  district: string;

  @ToNumber()
  @IsNumber()
  @IsRequired()
  destiny: number;

  @ToNumber()
  @IsNumber()
  @IsRequired()
  state: number;

  @IsBoolean()
  @IsRequired()
  active: boolean;

  @IsString()
  @IsRequired()
  clfc: string;

  @IsString()
  @IsRequired()
  detailsMaintenance: string;

  @IsString()
  @IsRequired()
  description: string;

  @IsOptional()
  @IsString()
  file?: string;

  @IsNumber()
  @IsRequired()
  classification: number; // El ID de Classification

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyInstallationDto)
  installations?: CreatePropertyInstallationDto[];
}
