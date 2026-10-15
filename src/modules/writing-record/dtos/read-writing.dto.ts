import { Expose, Type } from 'class-transformer';
import { ReadPropertySummaryDto } from 'src/modules/property/dtos/read-property-summary.dto';

export class ReadWritingDto {
  @Expose()
  id: number;

  @Expose()
  writingNumber: number;

  @Expose()
  voteNumberJDAAC: number;

  @Expose()
  voteDateJDAAC: Date;

  @Expose()
  imageJDAAC: string;

  @Expose()
  voteNumberJDUA: number;

  @Expose()
  voteDateJDUA: Date;

  @Expose()
  imageJDUA: string;

  @Expose()
  domain: string;

  @Expose()
  folio: string;

  @Expose()
  tomo: string;

  @Expose()
  year: number;

  @Expose()
  department: string;

  @Expose()
  totalSurface: number;

  @Expose()
  coveredSurface: number;

  @Expose()
  improvementSurface: number;

  @Expose()
  improvementValue: number;

  @Expose()
  cadastralNomenclature: string;

  @Expose()
  ubicationMap: string;

  @Expose()
  cadastralInform: string;

  @Expose()
  actingNotary: string;

  @Expose()
  notaryContact: number;

  @Expose()
  interiorImage: string;

  @Expose()
  exteriorImage: string;

  @Expose()
  formalities: string;

  @Expose()
  documentation: string;

  @Expose()
  detailSpaces: string;

  @Expose()
  @Type(() => ReadPropertySummaryDto)
  property: ReadPropertySummaryDto;
}
