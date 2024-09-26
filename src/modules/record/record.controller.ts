import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { RecordService } from "./record.service";
import { Record } from "./entities/record.entity";
import { CreateRecordDto } from "./dtos/create-record.dto";
import { GenericResponse } from "src/shared/generic-response.dto";
import { plainToClass } from "class-transformer";
import { ReadRecordDto } from "./dtos/read-record.dto";

@Controller("record")
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  findAll(): Promise<Record[]> {
    return this.recordService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<GenericResponse<ReadRecordDto>> {
    const record = await this.recordService.findOne(id);
    const response = plainToClass(ReadRecordDto, record);
    return new GenericResponse<ReadRecordDto>(response);
  }

  @Post()
  async create(@Body() recordData: CreateRecordDto): Promise<GenericResponse<ReadRecordDto>> {
    const record = await this.recordService.create(recordData);
    const response = plainToClass(ReadRecordDto, record);
    return new GenericResponse<ReadRecordDto>(response);
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() recordData: Partial<Record>): Promise<Record> {
    return this.recordService.update(id, recordData);
  }

  @Delete(":id")
  remove(@Param("id") id: number): Promise<void> {
    return this.recordService.remove(id);
  }
}