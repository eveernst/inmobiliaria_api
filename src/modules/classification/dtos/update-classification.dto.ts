import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateClassificationDto } from './create-classification.dto';

// Only the name is editable, and it's optional. propertyId is left out;
// anything else (id, relations, timestamps) is rejected by the global
// forbidNonWhitelisted.
export class UpdateClassificationDto extends PartialType(
  OmitType(CreateClassificationDto, ['propertyId'] as const),
) {}
