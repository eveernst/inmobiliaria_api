import { Entity, Column, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Property } from "src/modules/property/entities/property.entity";

@Entity()
export class Insurance extends BaseEntity {
    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    phone: number;

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
    @Column()
    insuranceLink?: string;

    @Column()
    insuranceImage?: string;

    @Column()
    insuranceDate?: Date;

    // formulario anual
    @Column()
    AnualFormLink?: string;

    @Column()
    AnualFormImage?: string;

    @Column()
    AnualFormDate?: Date;

    @Column()
    observations: string;

    @Column({ nullable: true, length: 500 })
    filePath?: string;

    // Muchos seguros pueden pertenecer a una propiedad
    @ManyToOne(() => Property, property => property.insurances)
    @JoinColumn({ name: 'propertyId' })
    property: Property;
}