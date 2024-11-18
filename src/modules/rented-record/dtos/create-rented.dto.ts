import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';

export class CreateRentedDto {
    // datos del propietario
    @IsString()
    @IsNotEmpty()
    @IsRequired()
    ownerDetails: string;
    
    @IsString()
    @IsNotEmpty()
    @IsRequired()
    affectation: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    ownerContact: string;

    // datos del inquilino
    @IsString()
    @IsNotEmpty()
    @IsRequired()
    renterDetails: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    address: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    renterContact: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    locality: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    @IsDate()
    contratStartDate: Date;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    @IsDate()
    contratEndDate: Date;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    province: string;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    price: number;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    adjustmentType: string;

    @IsString()
    contractImage?: string;

    property: number;
}