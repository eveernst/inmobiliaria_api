import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Property } from 'src/modules/property/entities/property.entity';

@Entity()
export class Writing extends BaseEntity {
  @Column()
  writingNumber: number;

  @Column()
  voteNumberJDAAC: number;

  @Column()
  voteDateJDAAC: Date;

  @Column({ length: 1024, nullable: true })
  imageJDAAC: string;

  @Column()
  voteNumberJDUA: number;

  @Column()
  voteDateJDUA: Date;

  @Column({ length: 1024, nullable: true })
  imageJDUA: string;

  @Column()
  domain: string;

  @Column()
  folio: string;

  @Column()
  tomo: string;

  @Column()
  year: number;

  @Column()
  department: string;

  @Column()
  totalSurface: number;

  @Column()
  coveredSurface: number;

  @Column()
  improvementSurface: number;

  @Column()
  improvementValue: number;

  @Column()
  cadastralNomenclature: string;

  @Column({ length: 1024, nullable: true })
  ubicationMap: string;

  @Column({ length: 1024, nullable: true })
  cadastralInform: string;

  @Column()
  actingNotary: string;

  @Column()
  notaryContact: number;

  @Column({ length: 1024, nullable: true })
  interiorImage: string;

  @Column({ length: 1024, nullable: true })
  exteriorImage: string;

  @Column()
  formalities: string;

  @Column()
  documentation: string;

  @Column()
  detailSpaces: string;

  // Una escritura puede pertenecer a una propiedad
  @ManyToOne(() => Property, (property) => property.writings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;
}
