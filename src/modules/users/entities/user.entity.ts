import { UserRole } from 'src/shared/enums/user-role.enum';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Property } from 'src/modules/property/entities/property.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
  type: 'enum',
  enum: UserRole,
  default: UserRole.ADMIN,
})
role: UserRole;

  
  // Un usuario puede tener muchas propiedades
  @OneToMany(() => Property, property => property.user)
  property: Property[];

  // Un usuario puede tener muchas notificaciones
  @OneToMany(() => User, user => user.notifications)
  notifications: Notification[];
}