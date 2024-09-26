import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Property } from 'src/modules/property/entities/property.entity';

@Entity()
export class Record extends BaseEntity {
  @Column({ length: 100 })
  type: string;

  @Column({ length: 100 })
  file: string;

  // Muchos documentos pueden pertenecer a una propiedad
  @ManyToOne(() => Property, property => property.records)
  @JoinColumn({ name: 'property_id' })
  property: Property;
}