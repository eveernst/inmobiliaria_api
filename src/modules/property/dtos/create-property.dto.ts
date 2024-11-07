import { IsNumber, IsString } from "class-validator";
import { IsRequired } from "../../../shared/decorators/is-required.decorator";

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

    // @IsNumber()
    // @IsRequired()
    // idUser: number;

    @IsNumber()
    @IsRequired()
    classification: number;

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

    @IsString()
    @IsRequired()
    status: string;

    @IsString()
    @IsRequired()
    clfc: string;

    @IsNumber()
    @IsRequired()
    securityCodeARM: string;

    @IsString()
    @IsRequired()
    state: string;

    @IsString()
    @IsRequired()
    innerImage: string;

    @IsString()
    @IsRequired()
    outerImage: string;
}