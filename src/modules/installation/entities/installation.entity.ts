import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Property } from "src/modules/property/entities/property.entity";
import { Classification } from "src/modules/classification/entities/classification.entity";

@Entity()
export class Installation extends BaseEntity {
    @Column({ length: 100 })
    file: string;

    @Column()
    quantity: number;

    @Column({ length: 100 })
    name: string;

    // Muchas instalacion puede tener una propiedad
    @ManyToOne(() => Property, property => property.installation)
    @JoinColumn({ name: 'property_id' })
    property: Property;

    // Muchas instalaciones pueden tener una clasificacion
    @ManyToOne(() => Classification, classification => classification.installation)
    @JoinColumn({ name: 'classification_id' })
    classification: Classification;
}