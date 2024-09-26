import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, isString, IsString } from "class-validator";
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

    @IsBoolean()
    @IsNotEmpty()
    @IsRequired()
    property: boolean;

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
    @IsString()
    @IsNotEmpty()
    @IsRequired()
    insuranceLink: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    insuranceImage: string;

    @IsDate()
    @IsNotEmpty()
    @IsRequired()
    insuranceDate: Date;

    // formulario anual
    @IsString()
    @IsNotEmpty()
    @IsRequired()
    AnualFormLink: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    AnualFormImage: string;

    @IsDate()
    @IsNotEmpty()
    @IsRequired()
    AnualFormDate: Date;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    observations: string;
}