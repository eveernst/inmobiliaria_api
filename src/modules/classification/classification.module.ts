import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import { Classification } from './entities/classification.entity';
import { Property } from '../property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classification, Property])],
  controllers: [ClassificationController],
  providers: [ClassificationService],
})
export class ClassificationModule {}