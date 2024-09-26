import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Plan } from "./entities/plan.entity"
import { CreatePlanDto } from "./dtos/create-plan.dto"

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepository: Repository<Plan>,
    ) {}

    findAll(): Promise<Plan[]> {
        return this.planRepository.find()
    }

    findOne(id: number): Promise<Plan> {
        return this.planRepository.findOne({ where: { id } })
    }

    async create(planData: CreatePlanDto): Promise<Plan> {
        const plan = this.planRepository.create(planData)
        return await this.planRepository.save(plan)
    }

    async update(id: number, planData: Partial<Plan>): Promise<Plan> {
        await this.planRepository.update(id, planData)
        return this.findOne(id)
    }

    async remove(id: number): Promise<void> {
        await this.planRepository.delete(id)
    }
}