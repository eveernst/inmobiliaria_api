import { IsNumber, IsString, IsBoolean } from "class-validator";
import { IsRequired } from "../../../shared/decorators/is-required.decorator";
import { Installation } from "src/modules/installation/entities/installation.entity";
import { ReadInstallationDto } from "src/modules/installation/dtos/read-installation.dto";

export class CreatePropertyDto {
    @IsString()
    @IsRequired()
    address: string;

    @IsString()
    @IsRequired()
    destiny: string;

    @IsString()
    @IsRequired()
    detailsMaintenance: string;

    @IsString()
    @IsRequired()
    file: string;

    @IsNumber()
    @IsRequired()
    classification: number;  // El ID de Classification

    @IsNumber()
    @IsRequired()
    goodUseCode: number;

    @IsString()
    @IsRequired()
    description: string;

    @IsString()
    @IsRequired()
    province: string;

    @IsString()
    @IsRequired()
    locality: string;

    @IsString()
    @IsRequired()
    betweenStreets: string;

    @IsNumber()
    @IsRequired()
    postalCode: number;

    @IsString()
    @IsRequired()
    district: string;

    @IsString()
    @IsRequired()
    destinyUse: string;

    @IsBoolean()
    @IsRequired()
    active: boolean;

    @IsString()
    @IsRequired()
    clfc: string;

    @IsNumber()
    @IsRequired()
    securityCodeARM: string;

    @IsNumber()
    @IsRequired()
    state: number;

    @IsString()
    @IsRequired()
    innerImage: string;

    @IsString()
    @IsRequired()
    outerImage: string;

    installations?: ReadInstallationDto[];
}
