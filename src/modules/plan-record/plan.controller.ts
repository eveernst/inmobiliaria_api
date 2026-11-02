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
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { ReadPlanDto } from './dtos/read-plan.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Controller('plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async findAll(): Promise<ReadPlanDto[]> {
    const items = await this.planService.findAll();
    return plainToInstance(ReadPlanDto, items, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericResponse<ReadPlanDto>> {
    const plan = await this.planService.findOne(id);
    const response = plainToInstance(ReadPlanDto, plan, {
      excludeExtraneousValues: true,
    });
    return new GenericResponse<ReadPlanDto>(response);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() planData: CreatePlanDto): Promise<ReadPlanDto> {
    const created = await this.planService.create(planData);
    return plainToInstance(ReadPlanDto, created, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() planData: UpdatePlanDto,
  ): Promise<ReadPlanDto> {
    const updated = await this.planService.update(id, planData);
    return plainToInstance(ReadPlanDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.planService.remove(id);
  }
}
