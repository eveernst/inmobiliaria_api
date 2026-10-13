import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreatePropertyDto } from './create-property.dto';
import { UpdatePropertyInstallationDto } from './update-property-installation.dto';

// The editable fields of a property, all optional. Anything else (id,
// relations, timestamps) is rejected by the global forbidNonWhitelisted.
export class UpdatePropertyDto extends PartialType(
  OmitType(CreatePropertyDto, ['installations'] as const),
) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePropertyInstallationDto)
  installations?: UpdatePropertyInstallationDto[];
}
