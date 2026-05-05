import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Property } from 'src/modules/property/entities/property.entity';

@Entity()
export class Insurance extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ type: 'bigint', unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  insuredProperty: string;

  // tipo de seguro q se registra
  // responsabilidad civil
  @Column()
  insuranceARM: boolean;

  @Column()
  insuranceASE: boolean;

  @Column()
  team: boolean;

  @Column()
  content: boolean;

  @Column()
  values: boolean;

  // formulario del seguro
  @Column({ length: 1024, nullable: true })
  insuranceLink?: string;

  @Column({ length: 1024, nullable: true })
  insuranceImage?: string;

  @Column()
  insuranceDate?: Date;

  // formulario anual
  @Column({ length: 1024, nullable: true })
  AnualFormLink?: string;

  @Column({ length: 1024, nullable: true })
  AnualFormImage?: string;

  @Column()
  AnualFormDate?: Date;

  @Column()
  observations: string;

  // Muchos seguros pueden pertenecer a una propiedad
  @ManyToOne(() => Property, (property) => property.insurances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;
}
