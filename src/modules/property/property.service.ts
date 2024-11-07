import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Property } from "./entities/property.entity";
import { CreatePropertyDto } from "./dtos/create-property.dto";
import { Classification } from "../classification/entities/classification.entity";

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>
  ) {}

  findAll(): Promise<Property[]> {
    return this.propertyRepository.find();
  }

  findOne(id: number): Promise<Property> {
    return this.propertyRepository.findOne({ where: { id } });
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {

    // Busca la clasificación utilizando el ID proporcionado
    const classification = await this.classificationRepository.findOne({
      where: { id: createPropertyDto.classification },
    });

    if (!classification) {
      throw new Error('Classification not found');
    }

    // Crea una nueva instancia de Property, incluyendo la clasificación cargada
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      classification,
    });

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