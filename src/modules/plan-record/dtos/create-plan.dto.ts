import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsRequired } from "src/shared/decorators/is-required.decorator";

export class CreatePlanDto {
    // plano general
    @IsBoolean()
    @IsNotEmpty()
    generalPlan: boolean;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    planNumber: number;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    year: number;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    planImage: string;

    // plano estructura
    @IsBoolean()
    @IsNotEmpty()
    structurePlan: boolean;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    structureImage: string;

    // plano gas
    @IsBoolean()
    @IsNotEmpty()
    gasPlan: boolean;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    gasImage: string;

    // plano agua
    @IsBoolean()
    @IsNotEmpty()
    waterPlan: boolean;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    waterImage: string;

    // plano luz
    @IsBoolean()
    @IsNotEmpty()
    lightPlan: boolean;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    lightImage: string;

    // ante proyecto
    @IsBoolean()
    @IsNotEmpty()
    projectPlan: boolean;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    projectImage: string;

    // final de obra
    @IsBoolean()
    @IsNotEmpty()
    finalPlan: boolean;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    finalImage: string;

    // actualizacion
    @IsString()
    @IsNotEmpty()
    @IsRequired()
    planType: string;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    planNumberUpdate: number;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    yearUpdate: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    stateImage: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    professional: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    professionalContact: string;

    // visado municipal
    @IsString()
    @IsNotEmpty()
    @IsRequired()
    @IsDate()
    dateVisado: Date;

    @IsNumber()
    @IsNotEmpty()
    @IsRequired()
    numberVisado: number;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    imageVisado: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    formalities: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    documentation: string;

    @IsString()
    @IsNotEmpty()
    @IsRequired()
    contacts: string;
}