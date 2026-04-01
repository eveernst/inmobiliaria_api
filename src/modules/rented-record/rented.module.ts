import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentedService } from './rented.service';
import { RentedController } from './rented.controller';
import { Rented } from './entities/rented.entity';
import { Property } from '../property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rented, Property])],
  controllers: [RentedController],
  providers: [RentedService],
})
export class RentedModule {}
