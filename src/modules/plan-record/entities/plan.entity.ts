import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "src/shared/entities/base.entity";
// import { PropertyPlan } from "src/modules/property-plan/entities/record.entity";
import { Property } from "src/modules/property/entities/property.entity";

@Entity()
export class Plan extends BaseEntity {
    @Column()
    generalPlan: boolean;

    @Column()
    planNumber: number;

    @Column()
    year: number;

    @Column()
    planImage: string;

    @Column()
    structurePlan: boolean;

    @Column()
    structureImage: string;

    @Column()
    gasPlan: boolean;

    @Column()
    gasImage: string;

    @Column()
    waterPlan: boolean;

    @Column()
    waterImage: string;

    @Column()
    lightPlan: boolean;

    @Column()
    lightImage: string;

    @Column()
    projectPlan: boolean;

    @Column()
    projectImage: string;

    @Column()
    finalPlan: boolean;

    @Column()
    finalImage: string;

    @Column()
    planType: string;

    @Column()
    planNumberUpdate: number;

    @Column()
    yearUpdate: string;

    @Column()
    stateImage: string;

    @Column()
    profesional: string;

    @Column()
    professionalContact: string;

    @Column()
    dateVisado: Date;

    @Column()
    numberVisado: number;

    @Column()
    imageVisado: string;

    @Column()
    formalities: string;

    @Column()
    documentation: string;

    @Column()
    contacts: string;

    // Un plan puede tener muchas propiedades
    @ManyToOne(() => Property, property => property.plan)
    @JoinColumn({ name: 'property_id' })
    property: Property;
}