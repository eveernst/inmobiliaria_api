import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Property } from 'src/modules/property/entities/property.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: number;

  // Un usuario puede tener muchas propiedades
  @OneToMany(() => Property, (property) => property.user)
  property: Property[];

  // Un usuario puede tener muchas notificaciones
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
