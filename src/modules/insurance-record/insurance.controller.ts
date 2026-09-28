import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { Insurance } from './entities/insurance.entity';
import { CreateInsuranceDto } from './dtos/create-insurance.dto';
import { ReadInsuranceDto } from './dtos/read-insurance.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('insurance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Get()
  findAll(): Promise<Insurance[]> {
    return this.insuranceService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<GenericResponse<ReadInsuranceDto>> {
    const insurance = await this.insuranceService.findOne(id);
    const response = plainToClass(ReadInsuranceDto, insurance);
    return new GenericResponse<ReadInsuranceDto>(response);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() insuranceData: CreateInsuranceDto): Promise<Insurance> {
    return this.insuranceService.create(insuranceData);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: number,
    @Body() insuranceData: Partial<Insurance>,
  ): Promise<Insurance> {
    return this.insuranceService.update(id, insuranceData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.insuranceService.remove(id);
  }
}
