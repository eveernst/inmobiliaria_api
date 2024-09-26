import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Property } from "./entities/property.entity";
import { CreatePropertyDto } from "./dtos/create-property.dto";

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>
  ) {}

  findAll(): Promise<Property[]> {
    return this.propertyRepository.find();
  }

  findOne(id: number): Promise<Property> {
    return this.propertyRepository.findOne({ where: { id } });
  }

  async create(propertyData: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(propertyData);
    return await this.propertyRepository.save(property);
  }

  async update(id: number, propertyData: Partial<Property>): Promise<Property> {
    await this.propertyRepository.update(id, propertyData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.propertyRepository.delete(id);
  }
}