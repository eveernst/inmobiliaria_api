import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from 'src/modules/property/entities/property.entity';
import { Plan } from 'src/modules/plan-record/entities/plan.entity';

@Entity()
export class PropertyPlan {
  // Muchos documentos pueden pertenecer a un plano de casa
  @ManyToOne(() => Plan, plan => plan.propertyPlans)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  // Muchos documentos pueden pertenecer a una propiedad
  // @ManyToOne(() => Property, property => property.records)
  // @JoinColumn({ name: 'property_id' })
  // property: Property;
}