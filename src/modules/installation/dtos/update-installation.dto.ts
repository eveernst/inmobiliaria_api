import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateInstallationDto } from './create-installation.dto';

// Every field is optional; propertyId is left out (an installation can't move
// to another property). Anything else (id, relations, timestamps) is rejected
// by the global forbidNonWhitelisted.
export class UpdateInstallationDto extends PartialType(
  OmitType(CreateInstallationDto, ['propertyId'] as const),
) {}
