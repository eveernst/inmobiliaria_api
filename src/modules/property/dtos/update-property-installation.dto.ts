import { IsInt, IsOptional } from 'class-validator';
import { CreatePropertyInstallationDto } from './create-property-installation.dto';

// An installation sent inside PUT /property/:id. Existing installations carry
// their id so they are updated in place instead of recreated (#47).
export class UpdatePropertyInstallationDto extends CreatePropertyInstallationDto {
  @IsOptional()
  @IsInt()
  id?: number;
}
