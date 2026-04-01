import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { Insurance } from './entities/insurance.entity';
import { Property } from '../property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Insurance, Property])],
  controllers: [InsuranceController],
  providers: [InsuranceService],
})
export class InsuranceModule {}
