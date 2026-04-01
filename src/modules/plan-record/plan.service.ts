import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { Property } from '../property/entities/property.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  findAll(): Promise<Plan[]> {
    return this.planRepository.find({ relations: ['property'] });
  }

  findOne(id: number): Promise<Plan> {
    return this.planRepository.findOne({
      where: { id },
      relations: ['property'],
    });
  }

  async update(id: number, planData: Partial<Plan>): Promise<Plan> {
    await this.planRepository.update(id, planData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.planRepository.delete(id);
  }

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    if (!createPlanDto.propertyId) {
      throw new BadRequestException('propertyId is required');
    }

    const property = await this.propertyRepository.findOne({
      where: { id: createPlanDto.propertyId },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    const plan = this.planRepository.create({
      ...createPlanDto,
      property,
    });
    await this.planRepository.save(plan);
    return plan;
  }
}
