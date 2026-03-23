import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, OneToMany } from "typeorm";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Property } from "src/modules/property/entities/property.entity";
import { Installation } from "src/modules/installation/entities/installation.entity";

@Entity()
export class Classification extends BaseEntity {

    @Column({ length: 100 })
    name: string;

    @OneToMany(() => Property, property => property.classification)
    properties: Property[];

    // Una clasificacion puede tener muchas instalaciones
    @OneToMany(() => Classification, classification => classification.installations)
    installations: Installation[];
}