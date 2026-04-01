import { Expose, Type } from 'class-transformer';
import { ReadClassificationDto } from 'src/modules/classification/dtos/read-classification.dto';
import { ReadInstallationDto } from 'src/modules/installation/dtos/read-installation.dto';
import { ReadInsuranceDto } from 'src/modules/insurance-record/dtos/read-insurance.dto';
import { ReadPlanDto } from 'src/modules/plan-record/dtos/read-plan.dto';
import { ReadRentedDto } from 'src/modules/rented-record/dtos/read-rented.dto';
import { ReadWritingDto } from 'src/modules/writing-record/dtos/read-writing.dto';
export class ReadPropertyInstallationDto {
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
  @Type(() => ReadInstallationDto) // Mapeará automáticamente al sub-DTO
  installations: ReadInstallationDto[];

  @Expose()
  @Type(() => ReadInsuranceDto) // Mapeará automáticamente al sub-DTO
  insurances: ReadInsuranceDto[];

  @Expose()
  @Type(() => ReadPlanDto) // Mapeará automáticamente al sub-DTO
  plans: ReadPlanDto[];

  @Expose()
  @Type(() => ReadRentedDto) // Mapeará automáticamente al sub-DTO
  renteds: ReadRentedDto[];

  @Expose()
  @Type(() => ReadWritingDto) // Mapeará automáticamente al sub-DTO
  writings: ReadWritingDto[];

  @Expose()
  id: number;
}
