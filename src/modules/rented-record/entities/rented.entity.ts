import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity()
export class Rented extends BaseEntity {
    @Column({ length: 100 })
    ownerDetails: string;

    @Column({ length: 100 })
    affectation: string;

    @Column({ length: 100 })
    ownerContact: string;

    @Column({ length: 100 })
    renterDetails: string;

    @Column({ length: 100 })
    adress: string;

    @Column({ length: 100 })
    renterContact: string;

    @Column({ length: 100 })
    locality: string;

    @Column()
    contratStartDate: Date;

    @Column()
    contratEndDate: Date;

    @Column({ length: 100 })
    province: string;

    @Column()
    price: number;

    @Column({ length: 100 })
    adjustmentType: string;

    @Column()
    contractImage: string;
}