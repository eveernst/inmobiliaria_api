import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateInsuranceDto } from './create-insurance.dto';

// Every field of the Create DTO, optional. propertyId is left out so a
// document can't be moved to another property; anything else (id,
// relations, timestamps) is rejected by the global forbidNonWhitelisted.
export class UpdateInsuranceDto extends PartialType(
  OmitType(CreateInsuranceDto, ['propertyId'] as const),
) {}
