import { Expose } from "class-transformer";

export class ReadRecordDto {
    @Expose()
    type: string;

    @Expose()
    file: string;
}