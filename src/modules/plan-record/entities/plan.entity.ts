import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
// import { PropertyPlan } from "src/modules/property-plan/entities/record.entity";
import { Property } from 'src/modules/property/entities/property.entity';

@Entity()
export class Plan extends BaseEntity {
  @Column()
  generalPlan: boolean;

  @Column()
  planNumber: number;

  @Column()
  year: number;

  @Column({ nullable: true, length: 1024 })
  planImage: string;

  @Column({ name: 'profesional' })
  professional: string;

  @Column()
  professionalContact: string;

  @Column()
  numberVisado: number;

  @Column()
  dateVisado: Date;

  @Column()
  structurePlan: boolean;

  @Column({ nullable: true, length: 1024 })
  structureImage: string;

  @Column()
  gasPlan: boolean;

  @Column({ nullable: true, length: 1024 })
  gasImage: string;

  @Column()
  waterPlan: boolean;

  @Column({ nullable: true, length: 1024 })
  waterImage: string;

  @Column()
  lightPlan: boolean;

  @Column({ nullable: true, length: 1024 })
  lightImage: string;

  @Column()
  projectPlan: boolean;

  @Column({ nullable: true, length: 1024 })
  projectImage: string;

  @Column()
  finalPlan: boolean;

  @Column({ nullable: true, length: 1024 })
  finalImage: string;

  @Column()
  planType: string;

  @Column()
  planNumberUpdate: number;

  @Column()
  yearUpdate: number;

  @Column({ nullable: true, length: 1024 })
  stateImage: string;

  @Column({ nullable: true, length: 1024 })
  imageVisado: string;

  @Column()
  formalities: string;

  @Column()
  documentation: string;

  @Column()
  contacts: string;

  // Un plan puede tener muchas propiedades
  @ManyToOne(() => Property, (property) => property.plans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;
}
