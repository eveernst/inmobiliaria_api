import { Expose } from "class-transformer";

export class ReadInstallationDto {

    @Expose()
    id: number;
    
    @Expose()
    file: string;

    @Expose()
    quantity: number;

    @Expose()
    name: string;
}