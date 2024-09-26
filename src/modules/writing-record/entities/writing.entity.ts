import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity()
export class Writing extends BaseEntity {
  @Column()
    writingNumber: number;

  @Column()
   voteNumberJDAAC: number;

  @Column()
  voteDateJDAAC: Date;

  @Column()
  imageJDAAC: string;

  @Column()
  voteNumberJDUA: number;

  @Column()
  voteDateJDUA: Date;

  @Column()
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

  @Column()
  ubicationMap: string;

  @Column()
  cadastralInform: string;

  @Column()
  actingNotary: string;

  @Column()
  notaryContact: number;

  @Column()
  interiorImage: string;

  @Column()
  exteriorImage: string;

  @Column()
  formalities: string;

  @Column()
  documentation: string;

  @Column()
  detailSpaces: string;
}