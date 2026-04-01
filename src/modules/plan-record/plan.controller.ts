import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { ReadPlanDto } from './dtos/read-plan.dto';
import { GenericResponse } from 'src/shared/generic-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  findAll(): Promise<Plan[]> {
    return this.planService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<GenericResponse<ReadPlanDto>> {
    const plan = await this.planService.findOne(id);
    const response = plainToClass(ReadPlanDto, plan);
    return new GenericResponse<ReadPlanDto>(response);
  }

  @Post()
  create(@Body() planData: CreatePlanDto): Promise<Plan> {
    return this.planService.create(planData);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() planData: Partial<Plan>,
  ): Promise<Plan> {
    return this.planService.update(id, planData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.planService.remove(id);
  }
}
