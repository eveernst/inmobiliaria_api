import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Writing } from "./entities/writing.entity";
import { CreateWritingDto } from "./dtos/create-writing.dto";
import { Property } from "../property/entities/property.entity";

@Injectable()
export class WritingService {
  constructor(
    @InjectRepository(Writing)
    private readonly writingRepository: Repository<Writing>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  findAll(): Promise<Writing[]> {
    return this.writingRepository.find();
  }

  findOne(id: number): Promise<Writing> {
    return this.writingRepository.findOne({ where: { id } });
  }

  async update(id: number, writingData: Partial<Writing>): Promise<Writing> {
    await this.writingRepository.update(id, writingData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.writingRepository.delete(id);
  }

  async create(createWritingDto: CreateWritingDto): Promise<Writing> {
          
    const property = await this.propertyRepository.findOne({
      where: { id: createWritingDto.propertyId },
      });
    const writing = this.writingRepository.create({
      ...createWritingDto,
      property,
      });
    await this.writingRepository.save(writing);
    return writing;
    }
}