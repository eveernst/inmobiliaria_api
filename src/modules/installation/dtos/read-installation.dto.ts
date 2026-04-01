import { Expose, Type } from 'class-transformer';
import { ReadClassificationDto } from 'src/modules/classification/dtos/read-classification.dto';

export class ReadInstallationDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  file?: string;

  @Expose()
  details: string;

  @Expose()
  @Type(() => ReadClassificationDto)
  classification: ReadClassificationDto;
}
