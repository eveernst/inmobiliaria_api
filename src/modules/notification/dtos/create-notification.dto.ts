import { IsDate, IsNumber, IsString } from "class-validator";
import { IsRequired } from "../../../shared/decorators/is-required.decorator";

export class CreateNotificationDto {
    @IsString()
    @IsRequired()
    message: string;

    @IsString()
    @IsRequired()
    type: string;

    @IsDate()
    @IsRequired()
    date: Date;

    @IsNumber()
    @IsRequired()
    idUser: number;
}