import { IsNumber, IsString, IsBoolean } from "class-validator";
import { IsRequired } from "../../../shared/decorators/is-required.decorator";
import { Installation } from "src/modules/installation/entities/installation.entity";
import { ReadInstallationDto } from "src/modules/installation/dtos/read-installation.dto";

export class CreatePropertyDto {
    @IsNumber()
    @IsRequired()
    goodUseCode: number;

    @IsString()
    @IsRequired()
    innerImage: string;

    @IsString()
    @IsRequired()
    outerImage: string;

    @IsString()
    @IsRequired()
    province: string;

    @IsString()
    @IsRequired()
    locality: string;
    
    @IsString()
    @IsRequired()
    address: string;

    @IsNumber()
    @IsRequired()
    postalCode: number;

    @IsString()
    @IsRequired()
    betweenStreets1: string;

    @IsString()
    @IsRequired()
    betweenStreets2: string;

    @IsString()
    @IsRequired()
    district: string;

    @IsString()
    @IsRequired()
    destiny: string; // hablar cpn ale

    @IsNumber()
    @IsRequired()
    state: number;

    @IsBoolean()
    @IsRequired()
    active: boolean;

    @IsString()
    @IsRequired()
    clfc: string;

    @IsString()
    @IsRequired()
    detailsMaintenance: string;

    @IsString()
    @IsRequired()
    description: string;

    @IsString()
    @IsRequired()
    file: string;

    @IsNumber()
    @IsRequired()
    classification: number;  // El ID de Classification

    installations?: ReadInstallationDto[];
}
