import { OmitType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { CreatePropertyInstallationDto } from './create-property-installation.dto';

// An installation sent inside PUT /property/:id. Existing installations carry
// their id (#47 uses it to update in place instead of recreating them).
export class UpdatePropertyInstallationDto extends OmitType(
  CreatePropertyInstallationDto,
  ['classification'] as const,
) {
  @IsOptional()
  @IsInt()
  id?: number;

  // Optional until #47: GET /property/:id doesn't load the installation's
  // classification yet, so the form can't send it back (front #30).
  @IsOptional()
  @IsNumber()
  classification?: number;
}
