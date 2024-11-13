import { Expose } from "class-transformer";

export class ReadInstallationDto {
    @Expose()
    id: number;
    
    @Expose()
    name: string;
    
    @Expose()
    quantity: number;
    
    @Expose()
    file: string;

    @Expose()
    details: string;
}