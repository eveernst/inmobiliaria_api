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
} from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceDto } from './dtos/create-insurance.dto';
import { UpdateInsuranceDto } from './dtos/update-insurance.dto';
import { ReadInsuranceDto } from './dtos/read-insurance.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('insurance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Get()
  async findAll(): Promise<ReadInsuranceDto[]> {
    const items = await this.insuranceService.findAll();
    return plainToInstance(ReadInsuranceDto, items, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericResponse<ReadInsuranceDto>> {
    const insurance = await this.insuranceService.findOne(id);
    const response = plainToInstance(ReadInsuranceDto, insurance, {
      excludeExtraneousValues: true,
    });
    return new GenericResponse<ReadInsuranceDto>(response);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() insuranceData: CreateInsuranceDto,
  ): Promise<ReadInsuranceDto> {
    const created = await this.insuranceService.create(insuranceData);
    return plainToInstance(ReadInsuranceDto, created, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() insuranceData: UpdateInsuranceDto,
  ): Promise<ReadInsuranceDto> {
    const updated = await this.insuranceService.update(id, insuranceData);
    return plainToInstance(ReadInsuranceDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.insuranceService.remove(id);
  }
}
