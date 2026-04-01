import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classification } from './entities/classification.entity';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
  ) {}

  findAll(): Promise<Classification[]> {
    return this.classificationRepository.find();
  }

  findOne(id: number): Promise<Classification> {
    return this.classificationRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    classificationData: Partial<Classification>,
  ): Promise<Classification> {
    await this.classificationRepository.update(id, classificationData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.classificationRepository.delete(id);
  }
}
