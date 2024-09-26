import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsRequired } from "src/shared/decorators/is-required.decorator";

export class CreateInstallationDto {
    @IsString()
    @IsNotEmpty()
    @IsRequired()
    file: string;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    name: string;
}