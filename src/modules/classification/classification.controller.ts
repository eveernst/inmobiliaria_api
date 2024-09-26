import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { Classification } from './entities/classification.entity';
import { CreateClassificationDto } from './dtos/create-classification.dto';
import { ReadClassificationDto } from './dtos/read-classification.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get()
  findAll(): Promise<Classification[]> {
    return this.classificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GenericResponse<ReadClassificationDto>> {
    const classification = await this.classificationService.findOne(id);
    const response = plainToClass(ReadClassificationDto, classification);
    return new GenericResponse<ReadClassificationDto>(response);
  }

  @Post()
  async create(@Body() classificationData: CreateClassificationDto): Promise<GenericResponse<ReadClassificationDto>> {
    const classification = await this.classificationService.create(classificationData);
    const response = plainToClass(ReadClassificationDto, classification);
    return new GenericResponse<ReadClassificationDto>(response);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() classificationData: Partial<Classification>): Promise<Classification> {
    return this.classificationService.update(id, classificationData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.classificationService.remove(id);
  }
}