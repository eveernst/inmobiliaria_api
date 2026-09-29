import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PropertyService } from './property.service';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';
import { ReadPropertyDto } from './dtos/read-property.dto';
import { ReadPropertyInstallationDto } from './dtos/read-property-installation.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';
import { PropertyFiltersDto } from './dtos/property-filters.dto';

type AuthenticatedRequest = Request & { user: { id: number } };

@Controller('property')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  findAll(@Query() filters: PropertyFiltersDto): Promise<ReadPropertyDto[]> {
    return this.propertyService.findAll(filters);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadPropertyInstallationDto> {
    return await this.propertyService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() propertyData: CreatePropertyDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<GenericResponse<ReadPropertyDto>> {
    const property = await this.propertyService.create(
      propertyData,
      request.user.id,
    );
    const response = plainToClass(ReadPropertyDto, property);
    return new GenericResponse<ReadPropertyDto>(response);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() propertyData: Partial<Property>,
  ): Promise<ReadPropertyInstallationDto> {
    console.log('=== UPDATE PROPERTY ===');
    console.log('ID:', id);
    console.log('Data received:', JSON.stringify(propertyData, null, 2));
    return this.propertyService.update(id, propertyData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.propertyService.remove(id);
  }
}
