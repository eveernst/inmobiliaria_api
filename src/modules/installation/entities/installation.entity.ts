import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Property } from "src/modules/property/entities/property.entity";
import { Classification } from "src/modules/classification/entities/classification.entity";

@Entity()
export class Installation extends BaseEntity {
    @Column({ length: 100 })
    name: string;
    
    @Column()
    quantity: number;
    
    @Column({ length: 100 })
    file?: string;

    @Column({ length: 500 })
    details: string;

    // Muchas instalacion puede tener una propiedad
    @ManyToOne(() => Property, property => property.installations)
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    // Muchas instalaciones pueden tener una clasificacion
    @ManyToOne(() => Classification, classification => classification.installations)
    @JoinColumn({ name: 'classificationId' })
    classification: Classification;
}