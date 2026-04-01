import { Expose } from 'class-transformer';

export class ReadPlanDto {
  @Expose()
  generalPlan: boolean;

  @Expose()
  planNumber: number;

  @Expose()
  year: number;

  @Expose()
  planImage: string;

  @Expose()
  structurePlan: boolean;

  @Expose()
  structureImage: string;

  @Expose()
  gasPlan: boolean;

  @Expose()
  gasImage: string;

  @Expose()
  waterPlan: boolean;

  @Expose()
  waterImage: string;

  @Expose()
  lightPlan: boolean;

  @Expose()
  lightImage: string;

  @Expose()
  projectPlan: boolean;

  @Expose()
  projectImage: string;

  @Expose()
  finalPlan: boolean;

  @Expose()
  finalImage: string;

  @Expose()
  planType: string;

  @Expose()
  planNumberUpdate: number;

  @Expose()
  yearUpdate: number;

  @Expose()
  stateImage: string;

  @Expose()
  professional: string;

  @Expose()
  professionalContact: string;

  @Expose()
  dateVisado: Date;

  @Expose()
  numberVisado: number;

  @Expose()
  imageVisado: string;

  @Expose()
  formalities: string;

  @Expose()
  documentation: string;

  @Expose()
  contacts: string;
}
