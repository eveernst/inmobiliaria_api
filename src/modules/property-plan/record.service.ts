import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Record } from "./entities/record.entity";
import { CreateRecordDto } from "./dtos/create-record.dto";

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>
  ) {}

  findAll(): Promise<Record[]> {
    return this.recordRepository.find();
  }

  findOne(id: number): Promise<Record> {
    return this.recordRepository.findOne({ where: { id } });
  }

  async create(recordData: CreateRecordDto): Promise<Record> {
    const record = this.recordRepository.create(recordData);
    return await this.recordRepository.save(record);
  }

  async update(id: number, recordData: Partial<Record>): Promise<Record> {
    await this.recordRepository.update(id, recordData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.recordRepository.delete(id);
  }
}