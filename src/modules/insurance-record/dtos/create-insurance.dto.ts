import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, isString, IsString } from "class-validator";
import { Property } from "src/modules/property/entities/property.entity";
import { IsRequired } from "src/shared/decorators/is-required.decorator";

export class CreateInsuranceDto {
    // responsable del seguro ARM
    @IsString()
    @IsNotEmpty()
    @IsRequired()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    phone: number;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @IsRequired()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    insuredProperty: string;

    // tipo de seguro q se registra
    // responsabilidad civil
    @IsBoolean()
    @IsNotEmpty()
    @IsRequired()
    insuranceARM: boolean;

    @IsBoolean()
    @IsNotEmpty()
    @IsRequired()
    insuranceASE: boolean;

    @IsRequired()
    property: number;

    @IsBoolean()
    @IsNotEmpty()
    @IsRequired()
    team: boolean;

    @IsBoolean()
    @IsNotEmpty()
    @IsRequired()
    content: boolean;

    @IsBoolean()
    @IsNotEmpty()
    @IsRequired()
    values: boolean;

    // formulario del seguro
    // @IsString()
    // insuranceLink?: string;

    // @IsString()
    // insuranceImage?: string;

    // @IsDate()
    // insuranceDate?: Date;

    // // formulario anual
    // @IsString()
    // AnualFormLink?: string;

    // @IsString()
    // AnualFormImage?: string;

    // @IsDate()
    // @IsNotEmpty()
    // @IsRequired()
    // AnualFormDate?: Date;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    observations: string;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    propertyId: number;
}