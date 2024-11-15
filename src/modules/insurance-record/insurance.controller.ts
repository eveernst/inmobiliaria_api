import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { Insurance } from './entities/insurance.entity';
import { CreateInsuranceDto } from './dtos/create-insurance.dto';
import { ReadInsuranceDto } from './dtos/read-insurance.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Get()
  findAll(): Promise<Insurance[]> {
    return this.insuranceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GenericResponse<ReadInsuranceDto>> {
    const insurance = await this.insuranceService.findOne(id);
    const response = plainToClass(ReadInsuranceDto, insurance);
    return new GenericResponse<ReadInsuranceDto>(response);
  }

  @Post()
  create(@Body() insuranceData: CreateInsuranceDto): Promise<Insurance> {
    return this.insuranceService.create(insuranceData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() insuranceData: Partial<Insurance>): Promise<Insurance> {
    return this.insuranceService.update(id, insuranceData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.insuranceService.remove(id);
  }
}