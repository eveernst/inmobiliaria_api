import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ToNumber } from '../../../shared/decorators/to-number.decorator';
import { CreatePropertyDto } from './create-property.dto';
import { UpdatePropertyInstallationDto } from './update-property-installation.dto';

// The editable fields of a property, all optional. Anything else (id,
// relations, timestamps) is rejected by the global forbidNonWhitelisted.
export class UpdatePropertyDto extends PartialType(
  OmitType(CreatePropertyDto, ['installations'] as const),
) {
  // PartialType adds @IsOptional(), which also lets null through. Redeclared
  // so an id may be omitted but never null, 0 or negative (#65): TypeORM drops
  // null conditions from a `where` and would match the first row.
  @ValidateIf((o: UpdatePropertyDto) => o.classification !== undefined)
  @ToNumber()
  @IsInt()
  @Min(1)
  classification?: number;

  @ValidateIf((o: UpdatePropertyDto) => o.user !== undefined)
  @ToNumber()
  @IsInt()
  @Min(1)
  user?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePropertyInstallationDto)
  installations?: UpdatePropertyInstallationDto[];
}
