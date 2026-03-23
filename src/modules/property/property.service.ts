import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Property } from "./entities/property.entity";
import { CreatePropertyDto } from "./dtos/create-property.dto";
import { Classification } from "../classification/entities/classification.entity";
import { Installation } from "../installation/entities/installation.entity";
import { ReadPropertyDto } from "./dtos/read-property.dto";
import { plainToInstance } from "class-transformer";
import { ReadPropertyInstallationDto } from "./dtos/read-property-installation.dto";
import { Insurance } from "../insurance-record/entities/insurance.entity";
import { Plan } from "../plan-record/entities/plan.entity";
import { Rented } from "../rented-record/entities/rented.entity";
import { Writing } from '../writing-record/entities/writing.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
    @InjectRepository(Installation)
    private readonly installationRepository: Repository<Installation>,
    @InjectRepository(Insurance)
    private readonly insuranceRepository: Repository<Insurance>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Rented)
    private readonly rentedRepository: Repository<Rented>,
    @InjectRepository(Writing)
    private readonly writingRepository: Repository<Writing>,
  ) {}

  async findAll(): Promise<ReadPropertyDto[]> {
    const properties = await this.propertyRepository.find({
      relations: [
        'classification',
        'installations',
        'installations.classification',
        'writings',
        'renteds',
        'insurances',
        'plans',
      ],
    });

    return plainToInstance(ReadPropertyDto, properties, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<ReadPropertyInstallationDto> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: [
        'classification',
        'installations',
        'writings',
        'renteds',
        'insurances',
        'plans',
      ],
    });

    if (!property) {
      throw new Error('Property not found');
    }

    return plainToInstance(ReadPropertyInstallationDto, property, {
      excludeExtraneousValues: true,
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

    await this.propertyRepository.save(property);

    if (createPropertyDto.installations) {
      const installations = createPropertyDto.installations.map(installation =>
        this.installationRepository.create({
          ...installation,
          property,
        }),
      );

      await this.installationRepository.save(installations);
    }

    return property;
  }

  async update(id: number, propertyData: Partial<Property>): Promise<ReadPropertyInstallationDto> {

    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['classification', 'installations', 'insurances', 'plans', 'renteds', 'writings'],
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const classificationId =
      typeof propertyData.classification === 'object'
        ? propertyData.classification?.id
        : parseInt(propertyData.classification as any);

    let classificationToSave = null;

    if (classificationId && !isNaN(classificationId)) {
      const classification = await this.classificationRepository.findOne({
        where: { id: classificationId },
      });

      if (!classification) {
        throw new Error('Classification not found');
      }

      classificationToSave = classification;
    }

    const {
      installations,
      classification,
      user,
      insurances,
      plans,
      renteds,
      writings,
      id: propertyId,
      ...propertyFields
    } = propertyData as any;

    await this.propertyRepository.update(id, propertyFields);

    if (classificationToSave) {
      await this.propertyRepository.update(id, { classification: classificationToSave });
    }

    if (installations && installations.length > 0) {
      await this.installationRepository.delete({ property: { id } });

      const newInstallations = installations.map(installation =>
        this.installationRepository.create({
          ...installation,
          property: { id },
        }),
      );

      await this.installationRepository.save(newInstallations);
    }

    const updatedProperty = await this.propertyRepository.findOne({
      where: { id },
      relations: ['classification', 'installations', 'insurances', 'plans', 'renteds', 'writings'],
    });

    if (!updatedProperty) {
      throw new Error('Error retrieving updated property');
    }

    return updatedProperty;
  }

  async remove(id: number): Promise<void> {
    await this.propertyRepository.delete(id);
  }

  async attachWriting(propertyId: number, filePath: string) {

    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['writings'],
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const writing = this.writingRepository.create({
      filePath: filePath.replace(/\\/g, '/'),
      property,
    });

    await this.writingRepository.save(writing);

    return property;
  }

  async attachPlan(propertyId: number, filePath: string) {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['plans'],
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const plan = this.planRepository.create({
      filePath: filePath.replace(/\\/g, '/'),
      property,
    } as any);

    await this.planRepository.save(plan);

    return property;
  }

  async attachInsurance(propertyId: number, filePath: string) {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['insurances'],
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const insurance = this.insuranceRepository.create({
      filePath: filePath.replace(/\\/g, '/'),
      property,
    } as any);

    await this.insuranceRepository.save(insurance);

    return property;
  }
}
