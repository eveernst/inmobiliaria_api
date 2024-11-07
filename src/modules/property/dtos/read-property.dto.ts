import { Expose } from "class-transformer";

export class ReadPropertyDto {
    @Expose()
    address: string;

    @Expose()
    classification: string;

    @Expose()
    destiny: string;

    @Expose()
    detailsMaintenance: string;

    @Expose()
    file: string;

    @Expose()
    idUser: number;

    @Expose()
    goodUseCode: number;

    @Expose()
    description: string;

    @Expose()
    province: string;

    @Expose()
    locality: string;

    @Expose()
    betweenStreets: string;

    @Expose()
    postalCode: number;

    @Expose()
    district: string;

    @Expose()
    destinyUse: string;
}