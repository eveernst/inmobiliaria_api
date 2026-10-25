import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsRequired } from 'src/shared/decorators/is-required.decorator';

// An installation created together with its property (POST /property).
// Unlike CreateInstallationDto it has no propertyId (the property doesn't
// exist yet). Installations have no classification (#47).
export class CreatePropertyInstallationDto {
  @IsString()
  @IsNotEmpty()
  @IsRequired()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  quantity: number;

  @IsOptional()
  @IsString()
  file?: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  details: string;
}
