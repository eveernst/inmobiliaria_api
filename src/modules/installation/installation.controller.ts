import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { InstallationService } from './installation.service';
import { Installation } from './entities/installation.entity';
import { CreateInstallationDto } from './dtos/create-installation.dto';
import { ReadInstallationDto } from './dtos/read-installation.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('installation')
export class InstallationController {
  constructor(private readonly installationService: InstallationService) {}

  @Get()
  findAll(): Promise<Installation[]> {
    return this.installationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GenericResponse<ReadInstallationDto>> {
    const installation = await this.installationService.findOne(id);
    const response = plainToClass(ReadInstallationDto, installation);
    return new GenericResponse<ReadInstallationDto>(response);
  }

  @Post()
  async create(@Body() installationData: CreateInstallationDto): Promise<GenericResponse<ReadInstallationDto>> {
    const installation = await this.installationService.create(installationData);
    const response = plainToClass(ReadInstallationDto, installation);
    return new GenericResponse<ReadInstallationDto>(response);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() installationData: Partial<Installation>): Promise<Installation> {
    return this.installationService.update(id, installationData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.installationService.remove(id);
  }
}