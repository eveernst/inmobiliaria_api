import { IsOptional, IsString } from 'class-validator';

export class PropertyFiltersDto {
  @IsOptional()
  @IsString()
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
