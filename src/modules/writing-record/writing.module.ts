import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WritingService } from './writing.service';
import { WritingController } from './writing.controller';
import { Writing } from './entities/writing.entity';
import { Property } from '../property/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Writing, Property])],
  controllers: [WritingController],
  providers: [WritingService],
})
export class WritingModule {}
