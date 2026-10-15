import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePlanDto } from './create-plan.dto';

// Every field of the Create DTO, optional. propertyId is left out so a
// document can't be moved to another property; anything else (id,
// relations, timestamps) is rejected by the global forbidNonWhitelisted.
export class UpdatePlanDto extends PartialType(
  OmitType(CreatePlanDto, ['propertyId'] as const),
) {}
