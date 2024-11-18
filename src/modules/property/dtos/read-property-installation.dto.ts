import { Expose, Type } from "class-transformer";
import { ReadClassificationDto } from "src/modules/classification/dtos/read-classification.dto";
import { ReadInstallationDto } from "src/modules/installation/dtos/read-installation.dto";
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
    destiny: string;

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
    id: number;
}
