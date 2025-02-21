import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Plan } from "./entities/plan.entity"
import { CreatePlanDto } from "./dtos/create-plan.dto"
import { Property } from "../property/entities/property.entity"

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepository: Repository<Plan>,
        @InjectRepository(Property)
        private readonly propertyRepository: Repository<Property>,
    ) {}

    findAll(): Promise<Plan[]> {
        return this.planRepository.find()
    }

    findOne(id: number): Promise<Plan> {
        return this.planRepository.findOne({ where: { id } })
    }

    async update(id: number, planData: Partial<Plan>): Promise<Plan> {
        await this.planRepository.update(id, planData)
        return this.findOne(id)
    }

    async remove(id: number): Promise<void> {
        await this.planRepository.delete(id)
    }

    async create(createPlanDto: CreatePlanDto): Promise<Plan> {
        const property = await this.propertyRepository.findOne({ 
            where: { id: createPlanDto.propertyId } 
        });
        const plan = this.planRepository.create({ 
            ...createPlanDto, 
            property, 
        });
        await this.planRepository.save(plan);
        return plan;
    }
}