import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Writing } from "./entities/writing.entity";
import { CreateWritingDto } from "./dtos/create-writing.dto";

@Injectable()
export class WritingService {
  constructor(
    @InjectRepository(Writing)
    private readonly writingRepository: Repository<Writing>
  ) {}

  findAll(): Promise<Writing[]> {
    return this.writingRepository.find();
  }

  findOne(id: number): Promise<Writing> {
    return this.writingRepository.findOne({ where: { id } });
  }

  async create(writingData: CreateWritingDto): Promise<Writing> {
    const writing = this.writingRepository.create(writingData);
    return await this.writingRepository.save(writing);
  }

  async update(id: number, writingData: Partial<Writing>): Promise<Writing> {
    await this.writingRepository.update(id, writingData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.writingRepository.delete(id);
  }
}