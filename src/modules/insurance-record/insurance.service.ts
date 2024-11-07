import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Insurance } from "./entities/insurance.entity";
import { CreateInsuranceDto } from "./dtos/create-insurance.dto";

@Injectable()
export class InsuranceService {
    constructor(
        @InjectRepository(Insurance)
        private readonly insuranceRepository: Repository<Insurance>,
    ) {}
    
    findAll(): Promise<Insurance[]> {
        return this.insuranceRepository.find();
    }
    
    findOne(id: number): Promise<Insurance> {
        return this.insuranceRepository.findOne({ where: { id } });
    }
        
    async update(id: number, insuranceData: Partial<Insurance>): Promise<Insurance> {
        await this.insuranceRepository.update(id, insuranceData);
        return this.findOne(id);
    }
    
    async remove(id: number): Promise<void> {
        await this.insuranceRepository.delete(id);
    }
}