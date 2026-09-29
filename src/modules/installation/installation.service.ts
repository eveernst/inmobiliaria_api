import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Installation } from './entities/installation.entity';
import { CreateInstallationDto } from './dtos/create-installation.dto';
import { Classification } from '../classification/entities/classification.entity';
import { ReadInstallationDto } from './dtos/read-installation.dto';
import { NotificationService } from '../notification/notification.service';
import { Property } from '../property/entities/property.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class InstallationService {
  constructor(
    @InjectRepository(Installation)
    private readonly installationRepository: Repository<Installation>,
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly notificationService: NotificationService,
  ) {}

  findAll(): Promise<ReadInstallationDto[]> {
    return this.installationRepository.find({
      relations: ['classification', 'property'],
    });
  }

  findOne(id: number): Promise<Installation> {
    return this.installationRepository.findOne({
      where: { id },
      relations: ['classification', 'property'],
    });
  }

  async create(
    installationData: CreateInstallationDto,
    actorUserId: number,
  ): Promise<Installation> {
    if (!installationData.propertyId) {
      throw new BadRequestException('propertyId is required');
    }

    const classification = await this.classificationRepository.findOne({
      where: { id: installationData.classificationId },
    });
    const property = await this.propertyRepository.findOne({
      where: { id: installationData.propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const data = { ...installationData, classification, property };
    const installation = this.installationRepository.create(data);
    const savedInstallation =
      await this.installationRepository.save(installation);

    await this.notificationService.createRegistrationNotification(
      actorUserId,
      'installation',
      savedInstallation.id,
      property,
    );

    return savedInstallation;
  }

  async update(
    id: number,
    installationData: Partial<Installation>,
  ): Promise<Installation> {
    await this.installationRepository.update(id, installationData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.installationRepository.delete(id);
  }
}
