import { Entity, Column, OneToMany, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Classification } from "src/modules/classification/entities/classification.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Record } from "src/modules/record/entities/record.entity";
import { Notification } from "src/modules/notification/entities/notification.entity";
import { Installation } from "src/modules/installation/entities/installation.entity";

@Entity()
export class Property extends BaseEntity {
  @Column({ length: 100 })
  adress: string;

  @Column({ length: 100 })
  destiny: string;

  @Column({ length: 100 })
  detailsMaintenance: string;

  @Column({ length: 100 })
  file: string;

  @Column()
  goodUseCode: number;

  @Column({ length: 100 })
  description: string;

  @Column({ length: 100 })
  province: string;

  @Column({ length: 100 })
  locality: string;

  @Column({ length: 100 })
  betweenStreets: string;

  @Column()
  postalCode: number;

  @Column({ length: 100 })
  district: string;

  @Column({ length: 100 })
  destinyUse: string;

  // Una propiedad puede tener muchas clasificaciones
  @OneToMany(() => Classification, classification => classification.property)
  classifications: Classification[];

  // Muchas propiedades pertenecen a un usuario
  @ManyToOne(() => User, user => user.property)
  @JoinColumn({ name: 'user_id' }) // Especifica el nombre de la FK en la tabla property
  user: User; 

  // Una propiedad puede tener muchos documentos
  @OneToMany(() => Record, record => record.property)
  records: Record[];

  // Una propiedad puede tener muchas notificaciones
  @OneToMany(() => Notification, notification => notification.property)
  notifications: Notification[];
  
  // Una propiedad puede tener muchas instalaciones
  @OneToMany(() => Installation, installation => installation.property)
  installation: Installation[];
}