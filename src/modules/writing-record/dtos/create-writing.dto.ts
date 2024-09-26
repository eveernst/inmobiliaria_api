import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsRequired } from "../../../shared/decorators/is-required.decorator";

export class CreateWritingDto {
    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    writingNumber: number;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    voteNumberJDAAC: number;

    @IsDate()
    @IsNotEmpty()
    @IsRequired()
    voteDateJDAAC: Date;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    imageJDAAC: string;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    voteNumberJDUA: number;

    @IsDate()
    @IsNotEmpty()
    @IsRequired()
    voteDateJDUA: Date;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    imageJDUA: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    domain: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    folio: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    tomo: string;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    year: number;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    department: string;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    totalSurface: number;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    coveredSurface: number;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    improvementSurface: number;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    improvementValue: number;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    cadastralNomenclature: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    ubicationMap: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    cadastralInform: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    actingNotary: string;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    notaryContact: number;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    interiorImage: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    exteriorImage: string;

    @IsString()
    formalities: string;

    @IsString()
    documentation: string;

    @IsString()
    detailSpaces: string;

}