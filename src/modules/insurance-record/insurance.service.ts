import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Insurance } from "./entities/insurance.entity";
import { CreateInsuranceDto } from "./dtos/create-insurance.dto";
import { Property } from "../property/entities/property.entity";

@Injectable()
export class InsuranceService {
    constructor(
        @InjectRepository(Insurance)
        private readonly insuranceRepository: Repository<Insurance>,
        @InjectRepository(Property)
        private readonly propertyRepository: Repository<Property>,
    ) {}
    
    findAll(): Promise<Insurance[]> {
        return this.insuranceRepository.find({ relations: ['property'] });
    }
    
    findOne(id: number): Promise<Insurance> {
        return this.insuranceRepository.findOne({ 
            where: { id },
            relations: ['property'],
        });
    }
        
    async update(id: number, insuranceData: Partial<Insurance>): Promise<Insurance> {
        await this.insuranceRepository.update(id, insuranceData);
        return this.findOne(id);
    }
    
    async remove(id: number): Promise<void> {
        await this.insuranceRepository.delete(id);
    }

    async create(createInsuranceDto: CreateInsuranceDto): Promise<Insurance> {
        
        const property = await this.propertyRepository.findOne({
            where: { id: createInsuranceDto.propertyId },
        });
        const insurance = this.insuranceRepository.create({
            ...createInsuranceDto,
            property,
        });
        await this.insuranceRepository.save(insurance);
        return insurance;
    }
}