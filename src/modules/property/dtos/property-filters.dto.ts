import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PropertyFiltersDto {
  @IsOptional()
  @IsString()
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
