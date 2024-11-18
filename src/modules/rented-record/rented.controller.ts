import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RentedService } from './rented.service';
import { Rented } from './entities/rented.entity';
import { CreateRentedDto } from './dtos/create-rented.dto';
import { ReadRentedDto } from './dtos/read-rented.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('rented')
export class RentedController {
  constructor(private readonly rentedService: RentedService) {}

  @Get()
  findAll(): Promise<Rented[]> {
    return this.rentedService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GenericResponse<ReadRentedDto>> {
    const rented = await this.rentedService.findOne(id);
    const response = plainToClass(ReadRentedDto, rented);
    return new GenericResponse<ReadRentedDto>(response);
  }

  @Post()
  create(@Body() rentedData: CreateRentedDto): Promise<Rented> {
    return this.rentedService.create(rentedData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() rentedData: Partial<Rented>): Promise<Rented> {
    return this.rentedService.update(id, rentedData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.rentedService.remove(id);
  }
}