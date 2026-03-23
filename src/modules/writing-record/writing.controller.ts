import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { WritingService } from './writing.service';
import { Writing } from './entities/writing.entity';
import { CreateWritingDto } from './dtos/create-writing.dto';
import { ReadWritingDto } from './dtos/read-writing.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('writing')
export class WritingController {
  constructor(private readonly writingService: WritingService) {}

  @Get()
  findAll(): Promise<Writing[]> {
    return this.writingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GenericResponse<ReadWritingDto>> {
    const writing = await this.writingService.findOne(id);
    const response = plainToClass(ReadWritingDto, writing);
    return new GenericResponse<ReadWritingDto>(response);
  }

  @Post()
  create(@Body() writingData: CreateWritingDto): Promise<Writing> {
    return this.writingService.create(writingData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() writingData: Partial<Writing>): Promise<Writing> {
    return this.writingService.update(id, writingData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.writingService.remove(id);
  }
}