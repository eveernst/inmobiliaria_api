import { Entity, Column } from "typeorm";
import { BaseEntity } from "src/shared/entities/base.entity";

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
    property: boolean;

    @Column()
    team: boolean;

    @Column()
    content: boolean;

    @Column()
    values: boolean;

    // formulario del seguro
    @Column()
    insuranceLink: string;

    @Column()
    insuranceImage: string;

    @Column()
    insuranceDate: Date;

    // formulario anual
    @Column()
    AnualFormLink: string;

    @Column()
    AnualFormImage: string;

    @Column()
    AnualFormDate: Date;

    @Column()
    observations: string;
}