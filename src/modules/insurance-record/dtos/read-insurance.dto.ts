import { Expose } from "class-transformer";
import { Property } from "src/modules/property/entities/property.entity";

export class ReadInsuranceDto {
    @Expose()
    name: string;

    @Expose()
    phone: number;

    @Expose()
    email: string;

    @Expose()
    insuredProperty: string;

    // tipo de seguro q se registra
    // responsabilidad civil
    @Expose()
    insuranceARM: boolean;

    @Expose()
    insuranceASE: boolean;

    @Expose()
    team: boolean;
    
    @Expose()
    content: boolean;
    
    @Expose()
    values: boolean;
    
    // formulario del seguro
    @Expose()
    insuranceLink?: string;
    
    @Expose()
    insuranceImage?: string;
    
    @Expose()
    insuranceDate?: Date;
    
    // formulario anual
    @Expose()
    AnualFormLink?: string;
    
    @Expose()
    AnualFormImage?: string;
    
    @Expose()
    AnualFormDate?: Date;
    
    @Expose()
    observations: string;
    
    @Expose()
    property: Property;
}