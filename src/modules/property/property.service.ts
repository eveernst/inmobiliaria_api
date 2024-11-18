import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Property } from "./entities/property.entity";
import { CreatePropertyDto } from "./dtos/create-property.dto";
import { Classification } from "../classification/entities/classification.entity";
import { ReadInstallationDto } from "../installation/dtos/read-installation.dto";
import { Installation } from "../installation/entities/installation.entity";
import { ReadPropertyDto } from "./dtos/read-property.dto";
import { plainToInstance } from "class-transformer";
import { ReadPropertyInstallationDto } from "./dtos/read-property-installation.dto";

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
    @InjectRepository(Installation)
    private readonly installationRepository: Repository<Installation>
  ) {}

  async findAll(): Promise<ReadPropertyDto[]> {
    const properties = await this.propertyRepository.find({
      relations: ['classification'], // Incluye la relación necesaria
    });

    // Transforma las entidades en instancias de ReadPropertyDto
    return plainToInstance(ReadPropertyDto, properties, {
      excludeExtraneousValues: true, // Solo incluye campos marcados con @Expose
    });
  } 

  async findOne(id: number): Promise<ReadPropertyInstallationDto> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['classification', 'installations'], // Incluye las relaciones necesarias
    });

    return plainToInstance(ReadPropertyInstallationDto, property, {
      excludeExtraneousValues: true, // Solo incluye campos marcados con @Expose
    });
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const classification = await this.classificationRepository.findOne({
        where: { id: createPropertyDto.classification },
    });

    if (!classification) {
        throw new Error('Classification not found');
    }

    const property = this.propertyRepository.create({
        ...createPropertyDto,
        classification,
    });
 console.log(property);
    await this.propertyRepository.save(property);

    // Guardar las instalaciones de esta propiedad
    if (createPropertyDto.installations) {
        // Crear las instalaciones en la base de datos y asociarlas a la propiedad
        const installations = createPropertyDto.installations.map(installation => {
            return this.installationRepository.create({
                ...installation,
                property,
            });
        });
        await this.installationRepository.save(installations);
    }
    return property;
}

  async update(id: number, propertyData: Partial<Property>): Promise<ReadPropertyInstallationDto> {
    await this.propertyRepository.update(id, propertyData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.propertyRepository.delete(id);
  }
}