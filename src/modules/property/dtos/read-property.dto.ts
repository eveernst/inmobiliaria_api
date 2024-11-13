import { Expose } from "class-transformer";

export class ReadPropertyDto {
    @Expose()
    goodUseCode: number;

    @Expose()
    innerImage: string;

    @Expose()
    outerImage: string;

    @Expose()
    file: string;

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
}