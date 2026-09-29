import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(InstallationService.name);

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

    // The notification is a side effect: if it fails, the installation is
    // already saved, so failing the request would only make the client retry
    // and create a duplicate.
    try {
      await this.notificationService.createRegistrationNotification(
        actorUserId,
        'installation',
        savedInstallation.id,
        property,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create registration notification for installation ${savedInstallation.id}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

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
