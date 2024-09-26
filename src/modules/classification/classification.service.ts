import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classification } from './entities/classification.entity';
import { CreateClassificationDto } from './dtos/create-classification.dto';
import { Property } from '../property/entities/property.entity';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  findAll(): Promise<Classification[]> {
    return this.classificationRepository.find();
  }

  findOne(id: number): Promise<Classification> {
    return this.classificationRepository.findOne({ where: { id } });
  }

  async create(classificationData: CreateClassificationDto): Promise<Classification> {
    const property = await this.propertyRepository.findOne({ where: { id: classificationData.property_id } });
    if (!property) {
      throw new Error('Property not found');
    }
    const classification = this.classificationRepository.create({
      ...classificationData,
      property,
    });
    return await this.classificationRepository.save(classification);
  }

  async update(id: number, classificationData: Partial<Classification>): Promise<Classification> {
    await this.classificationRepository.update(id, classificationData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.classificationRepository.delete(id);
  }
}