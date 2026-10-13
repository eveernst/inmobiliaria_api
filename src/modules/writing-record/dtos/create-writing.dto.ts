import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsRequired } from '../../../shared/decorators/is-required.decorator';

export class CreateWritingDto {
  // Text fields the form treats as optional arrive as ''. The columns are
  // NOT NULL, so '' is accepted and stored; omitting the field is rejected.

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  writingNumber: number;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  voteNumberJDAAC: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsRequired()
  voteDateJDAAC: Date;

  @IsOptional()
  @IsString()
  imageJDAAC?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  voteNumberJDUA: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsRequired()
  voteDateJDUA: Date;

  @IsOptional()
  @IsString()
  imageJDUA?: string;

  @IsString()
  domain: string;

  @IsString()
  folio: string;

  @IsString()
  tomo: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  year: number;

  @IsString()
  department: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  totalSurface: number;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  coveredSurface: number;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  improvementSurface: number;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  improvementValue: number;

  @IsString()
  cadastralNomenclature: string;

  @IsOptional()
  @IsString()
  ubicationMap?: string;

  @IsOptional()
  @IsString()
  cadastralInform?: string;

  @IsString()
  actingNotary: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  notaryContact: number;

  @IsOptional()
  @IsString()
  interiorImage?: string;

  @IsOptional()
  @IsString()
  exteriorImage?: string;

  @IsString()
  formalities: string;

  @IsString()
  documentation: string;

  @IsString()
  detailSpaces: string;

  @IsInt()
  @IsRequired()
  propertyId: number;
}
