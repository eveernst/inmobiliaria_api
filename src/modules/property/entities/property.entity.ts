import { Entity, Column, OneToMany, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Classification } from "src/modules/classification/entities/classification.entity";
import { User } from "src/modules/users/entities/user.entity";
// import { Record } from "src/modules/property-plan/entities/record.entity";
import { Notification } from "src/modules/notification/entities/notification.entity";
import { Installation } from "src/modules/installation/entities/installation.entity";
import { Plan } from "src/modules/plan-record/entities/plan.entity";
import { Rented } from "src/modules/rented-record/entities/rented.entity";
import { Writing } from "src/modules/writing-record/entities/writing.entity";
import { Insurance } from "src/modules/insurance-record/entities/insurance.entity";

@Entity()
export class Property extends BaseEntity {
  @Column()
  goodUseCode: number;

  @Column()
  innerImage: string;

  @Column()
  outerImage: string;

  @Column({ length: 255 })
  file: string;

  @Column({ length: 100 })
  province: string;

  @Column({ length: 100 })
  locality: string;
 
  @Column({ length: 100 })
  address: string;
  
  @Column()
  postalCode: number;
  
  @Column({ length: 100 })
  betweenStreets1: string;
  
  @Column({ length: 100 })
  betweenStreets2: string;
  
  @Column({ length: 100 })
  district: string;

  @Column({ length: 100 })
  destiny: string;

  @Column()
  state: number; // 1: alquilado, 2: disponible, 3: vendido, etc
  
  @Column()
  active: boolean;
  
  @Column()
  clfc: string;

  @Column({ length: 500 })
  detailsMaintenance: string;

  @Column({ length: 500 })
  description: string;

  // Muchas propiedades pertenecen a un usuario
  @ManyToOne(() => User, user => user.property)
  @JoinColumn({ name: 'user_id' }) // Especifica el nombre de la FK en la tabla property
  user: User;

  @ManyToOne(() => Classification, classification => classification.properties)
  @JoinColumn({ name: 'classification_id' }) // Especifica el nombre de la FK en la tabla property
  classification: Classification;

  // Una propiedad puede tener muchas notificaciones
  @OneToMany(() => Notification, notification => notification.property)
  notifications: Notification[];
  
  // Una propiedad puede tener muchas instalaciones
  @OneToMany(() => Installation, installation => installation.property)
  installations: Installation[];

  // Una propiedad puede tener muchos planos
  @OneToMany(() => Plan, plan => plan.property)
  plans: Plan[];

  // Una propiedad puede tener muchos alquileres
  @OneToMany(() => Rented, rented => rented.property)
  renteds: Rented[];

  // Una propiedad puede tener muchos escrituras
  @OneToMany(() => Writing, writing => writing.property)
  writings: Writing[];

  // Una propiedad puede tener muchos seguros
  @OneToMany(() => Insurance, insurance => insurance.property)
  insurances: Insurance[];
}