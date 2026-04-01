import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Classification } from '../classification/entities/classification.entity';
import { Installation } from '../installation/entities/installation.entity';
import { Insurance } from '../insurance-record/entities/insurance.entity';
import { Writing } from '../writing-record/entities/writing.entity';
import { Plan } from '../plan-record/entities/plan.entity';
import { Rented } from '../rented-record/entities/rented.entity';
import { Notification } from '../notification/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      Classification,
      Installation,
      Insurance,
      Writing,
      Plan,
      Rented,
      Notification,
    ]),
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
