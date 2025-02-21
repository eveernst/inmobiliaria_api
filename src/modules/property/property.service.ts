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
      relations: ['classification', 'installations', 'installations.classification'], // Incluye las relaciones necesarias
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
  // Buscar la propiedad con sus relaciones necesarias
  const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['classification', 'installations'],
  });

  if (!property) {
      throw new Error('Property not found');
  }

  // Verificar y asignar la nueva clasificación
  if (propertyData.classification?.id) {
      const classification = await this.classificationRepository.findOne({
          where: { id: propertyData.classification.id },
      });

      if (!classification) {
          throw new Error('Classification not found');
      }

      property.classification = classification;
  }

  // Actualizar los campos de la propiedad (sin relaciones)
  const { installations, classification, ...propertyFields } = propertyData;
  await this.propertyRepository.update(id, propertyFields); // Solo actualiza los campos simples

  // Actualizar las instalaciones
  if (installations && installations.length > 0) {
      // Eliminar instalaciones existentes
      await this.installationRepository.delete({ property: { id } });

      // Crear nuevas instalaciones asociadas a la propiedad
      const newInstallations = installations.map(installation =>
          this.installationRepository.create({
              ...installation,
              property: { id }, // Asociar solo el ID de la propiedad
          }),
      );

      await this.installationRepository.save(newInstallations);
  }

  // Retornar la propiedad actualizada con relaciones
  const updatedProperty = await this.propertyRepository.findOne({
      where: { id },
      relations: ['classification', 'installations'],
  });

  if (!updatedProperty) {
      throw new Error('Error retrieving updated property');
  }

  return updatedProperty;
}

  async remove(id: number): Promise<void> {
    await this.propertyRepository.delete(id);
  }
}