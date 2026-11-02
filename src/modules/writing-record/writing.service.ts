import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Writing } from './entities/writing.entity';
import { CreateWritingDto } from './dtos/create-writing.dto';
import { UpdateWritingDto } from './dtos/update-writing.dto';
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

  async findOne(id: number): Promise<Writing> {
    const writing = await this.writingRepository.findOne({
      where: { id },
      relations: ['property'],
    });
    if (!writing) {
      throw new NotFoundException('Writing not found');
    }
    return writing;
  }

  async update(id: number, writingData: UpdateWritingDto): Promise<Writing> {
    if (Object.keys(writingData).length > 0) {
      await this.writingRepository.update(id, writingData);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.writingRepository.delete(id);
    if (!affected) {
      throw new NotFoundException('Writing not found');
    }
  }

  async create(createWritingDto: CreateWritingDto): Promise<Writing> {
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
