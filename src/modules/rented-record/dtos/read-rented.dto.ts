import { Expose } from "class-transformer";

export class ReadRentedDto {
    // datos del propietario
    @Expose()
    ownerDetails: string;   

    @Expose()
    affectation: string;

    @Expose()
    ownerContact: string;

    // datos del inquilino
    @Expose()
    renterDetails: string;

    @Expose()
    adress: string;

    @Expose()
    renterContact: string;

    @Expose()
    locality: string;

    @Expose()
    contratStartDate: Date;

    @Expose()
    contratEndDate: Date;

    @Expose()
    province: string;

    @Expose()
    price: number;

    @Expose()
    adjustmentType: string;

    @Expose()
    contractImage: string;
}