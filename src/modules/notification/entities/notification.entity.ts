// crear demonio "cron" para enviar notificaciones a los usuarios

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Property } from 'src/modules/property/entities/property.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Notification extends BaseEntity {
    @Column({ length: 100 })
    message: string;

    @Column({ length: 100 })
    type: string;

    @Column()
    date: Date;

    // Muchas notificaciones pueden pertenecer a una propiedad
    @ManyToOne(() => Property, property => property.notifications)
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    // Muchas notificaciones pueden pertenecer a un usuario
    @ManyToOne(() => User, user => user.notifications)
    @JoinColumn({ name: 'userId' })
    user: User;
}