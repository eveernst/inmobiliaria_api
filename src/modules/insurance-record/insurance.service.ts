import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insurance } from './entities/insurance.entity';
import { CreateInsuranceDto } from './dtos/create-insurance.dto';
import { Property } from '../property/entities/property.entity';

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

  async findOne(id: number): Promise<Insurance> {
    const insurance = await this.insuranceRepository.findOne({
      where: { id },
      relations: ['property'],
    });
    if (!insurance) {
      throw new NotFoundException('Insurance not found');
    }
    return insurance;
  }

  async update(
    id: number,
    insuranceData: Partial<Insurance>,
  ): Promise<Insurance> {
    await this.insuranceRepository.update(id, insuranceData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.insuranceRepository.delete(id);
    if (!affected) {
      throw new NotFoundException('Insurance not found');
    }
  }

  async create(createInsuranceDto: CreateInsuranceDto): Promise<Insurance> {
    if (!createInsuranceDto.propertyId) {
      throw new BadRequestException('propertyId is required');
    }

    const property = await this.propertyRepository.findOne({
      where: { id: createInsuranceDto.propertyId },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    const insurance = this.insuranceRepository.create({
      ...createInsuranceDto,
      property,
    });
    await this.insuranceRepository.save(insurance);
    return insurance;
  }
}
