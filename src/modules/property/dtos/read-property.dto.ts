import { Expose, Type } from 'class-transformer';
import { ReadClassificationDto } from '../../classification/dtos/read-classification.dto';
export class ReadPropertyDto {
  @Expose()
  goodUseCode: number;

  @Expose()
  file?: string;

  @Expose()
  province: string;

  @Expose()
  locality: string;

  @Expose()
  address: string;

  @Expose()
  postalCode: number;

  @Expose()
  betweenStreets1: string;

  @Expose()
  betweenStreets2: string;

  @Expose()
  district: string;

  @Expose()
  destiny: number;

  @Expose()
  state: number; // 1: alquilado, 2: disponible, 3: vendido, etc

  @Expose()
  active: boolean;

  @Expose()
  clfc: string;

  @Expose()
  detailsMaintenance: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => ReadClassificationDto) // Mapeará automáticamente al sub-DTO
  classification: ReadClassificationDto;

  @Expose()
  id: number;
}
