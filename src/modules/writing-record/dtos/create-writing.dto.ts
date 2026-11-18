import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IsRequired } from '../../../shared/decorators/is-required.decorator';
import { NumberToText } from '../../../shared/decorators/to-text.decorator';
import { IsCalendarDate } from '../../../shared/decorators/is-calendar-date.decorator';

export class CreateWritingDto {
  // Text fields the form treats as optional arrive as ''. The columns are
  // NOT NULL, so '' is accepted and stored; omitting the field is rejected.

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsRequired()
  writingNumber: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsRequired()
  voteNumberJDAAC: number;

  @IsCalendarDate()
  @IsRequired()
  voteDateJDAAC: string;

  @IsOptional()
  @IsString()
  imageJDAAC?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsRequired()
  voteNumberJDUA: number;

  @IsCalendarDate()
  @IsRequired()
  voteDateJDUA: string;

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
  @Min(0)
  @IsRequired()
  year: number;

  @IsString()
  department: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsRequired()
  totalSurface: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsRequired()
  coveredSurface: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsRequired()
  improvementSurface: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
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

  @NumberToText()
  @IsString()
  @IsNotEmpty()
  @IsRequired()
  notaryContact: string;

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
