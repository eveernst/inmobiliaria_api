import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';
import { ReadPropertyDto } from './dtos/read-property.dto';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  findAll(): Promise<Property[]> {
    return this.propertyService.findAll();
  }

  @Post()
  async create(@Body() propertyData: CreatePropertyDto): Promise<GenericResponse<ReadPropertyDto>> {
    const property = await this.propertyService.create(propertyData);
    const response = plainToClass(ReadPropertyDto, property);
    return new GenericResponse<ReadPropertyDto>(response);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GenericResponse<ReadPropertyDto>> {
    const property = await this.propertyService.findOne(id);
    const response = plainToClass(ReadPropertyDto, property);
    return new GenericResponse<ReadPropertyDto>(response);
  }


  @Put(':id')
  update(@Param('id') id: number, @Body() propertyData: Partial<Property>): Promise<Property> {
    return this.propertyService.update(id, propertyData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.propertyService.remove(id);
  }
}