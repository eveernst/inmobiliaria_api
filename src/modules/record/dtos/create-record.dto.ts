import { IsNumber, IsString } from "class-validator";
import { IsRequired } from "../../../shared/decorators/is-required.decorator";

export class CreateRecordDto {
    @IsString()
    @IsRequired()
    type: string;

    @IsString()
    @IsRequired()
    file: string;

    @IsNumber()
    @IsRequired()
    property_id: number;
}