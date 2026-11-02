import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { PROVINCES } from '../../../shared/constants/provinces';

export class PropertyFiltersDto {
  @IsOptional()
  @IsIn(PROVINCES)
  province?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  classification?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  state?: number;

  @IsOptional()
  @IsString()
  address?: string;
}
