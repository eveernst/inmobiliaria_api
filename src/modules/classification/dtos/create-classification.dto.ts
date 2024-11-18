import { IsNumber, IsString } from "class-validator";
import { IsRequired } from "src/shared/decorators/is-required.decorator";

export class CreateClassificationDto {
    @IsString()
    @IsRequired()
    name: string;

    @IsNumber()
    @IsRequired()
    propertyId: number;
}