import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Writing } from './entities/writing.entity';
import { CreateWritingDto } from './dtos/create-writing.dto';
import { Property } from '../property/entities/property.entity';

@Injectable()
export class WritingService {
  constructor(
    @InjectRepository(Writing)
    private readonly writingRepository: Repository<Writing>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  findAll(): Promise<Writing[]> {
    return this.writingRepository.find({ relations: ['property'] });
  }

  findOne(id: number): Promise<Writing> {
    return this.writingRepository.findOne({
      where: { id },
      relations: ['property'],
    });
  }

  async update(id: number, writingData: Partial<Writing>): Promise<Writing> {
    await this.writingRepository.update(id, writingData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.writingRepository.delete(id);
  }

  async create(createWritingDto: CreateWritingDto): Promise<Writing> {
    if (!createWritingDto.propertyId) {
      throw new BadRequestException('propertyId is required');
    }

    const property = await this.propertyRepository.findOne({
      where: { id: createWritingDto.propertyId },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    const writing = this.writingRepository.create({
      ...createWritingDto,
      property,
    });
    await this.writingRepository.save(writing);
    return writing;
  }
}
