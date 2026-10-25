import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Property } from 'src/modules/property/entities/property.entity';

@Entity()
export class Classification extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Property, (property) => property.classification)
  properties: Property[];
}
