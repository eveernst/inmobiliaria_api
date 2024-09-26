import { Expose } from "class-transformer";

export class ReadInstallationDto {
    @Expose()
    file: string;

    @Expose()
    quantity: number;

    @Expose()
    name: string;
}