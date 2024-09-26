import { Expose } from "class-transformer";

export class ReadClassificationDto {
    @Expose()
    name: string;
}