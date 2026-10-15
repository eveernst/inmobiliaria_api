import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateWritingDto } from './create-writing.dto';

// Every field of the Create DTO, optional. propertyId is left out so a
// document can't be moved to another property; anything else (id,
// relations, timestamps) is rejected by the global forbidNonWhitelisted.
export class UpdateWritingDto extends PartialType(
  OmitType(CreateWritingDto, ['propertyId'] as const),
) {}
