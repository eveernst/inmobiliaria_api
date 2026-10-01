import { IsIn, IsOptional, IsString } from 'class-validator';
import { PROVINCES } from '../../../shared/constants/provinces';

export class PropertyFiltersDto {
  @IsOptional()
  @IsIn(PROVINCES)
  province?: string;

  @IsOptional()
  @IsString()
  classification?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
