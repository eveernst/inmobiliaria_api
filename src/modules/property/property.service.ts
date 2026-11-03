import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { Classification } from '../classification/entities/classification.entity';
import { Installation } from '../installation/entities/installation.entity';
import { ReadPropertyDto } from './dtos/read-property.dto';
import { plainToInstance } from 'class-transformer';
import { ReadPropertyInstallationDto } from './dtos/read-property-installation.dto';
import { Insurance } from '../insurance-record/entities/insurance.entity';
import { Plan } from '../plan-record/entities/plan.entity';
import { Rented } from '../rented-record/entities/rented.entity';
import { Writing } from '../writing-record/entities/writing.entity';
import { Notification } from '../notification/entities/notification.entity';
import { PropertyFiltersDto } from './dtos/property-filters.dto';
import { NotificationService } from '../notification/notification.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name);

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationService: NotificationService,
  ) {}

  async findAll(filters: PropertyFiltersDto = {}): Promise<ReadPropertyDto[]> {
    const relations = [
      'classification',
      'user',
      'installations',
      'writings',
      'renteds',
      'insurances',
      'plans',
    ];

    const hasFilters = Object.values(filters).some((value) =>
      typeof value === 'string' ? value.trim() !== '' : value !== undefined,
    );

    let properties: Property[];

    if (!hasFilters) {
      properties = await this.propertyRepository.find({ relations });
    } else {
      const query = this.propertyRepository
        .createQueryBuilder('property')
        .leftJoinAndSelect('property.classification', 'classification')
        .leftJoinAndSelect('property.user', 'user')
        .leftJoinAndSelect('property.installations', 'installations')
        .leftJoinAndSelect('property.writings', 'writings')
        .leftJoinAndSelect('property.renteds', 'renteds')
        .leftJoinAndSelect('property.insurances', 'insurances')
        .leftJoinAndSelect('property.plans', 'plans');

      if (filters.province) {
        query.andWhere('property.province = :province', {
          province: filters.province,
        });
      }

      if (filters.address?.trim()) {
        query.andWhere('LOWER(property.address) LIKE LOWER(:address)', {
          address: `%${filters.address.trim()}%`,
        });
      }

      if (filters.classification !== undefined) {
        query.andWhere('classification.id = :classificationId', {
          classificationId: filters.classification,
        });
      }

      if (filters.state !== undefined) {
        query.andWhere('property.state = :state', { state: filters.state });
      }

      properties = await query.getMany();
    }

    return plainToInstance(ReadPropertyDto, properties, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<ReadPropertyInstallationDto> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: [
        'classification',
        'user',
        'installations',
        'writings',
        'renteds',
        'insurances',
        'plans',
      ], // Incluye las relaciones necesarias
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return plainToInstance(ReadPropertyInstallationDto, property, {
      excludeExtraneousValues: true, // Solo incluye campos marcados con @Expose
    });
  }

  async create(
    createPropertyDto: CreatePropertyDto,
    actorUserId: number,
  ): Promise<Property> {
    const classification = await this.classificationRepository.findOne({
      where: { id: createPropertyDto.classification },
    });

    if (!classification) {
      throw new NotFoundException('Classification not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: createPropertyDto.user },
    });

    if (!user) {
      throw new NotFoundException('Responsible user not found');
    }

    const { installations: installationsData, ...propertyData } =
      createPropertyDto;

    const property = this.propertyRepository.create({
      ...propertyData,
      classification,
      user,
    });
    await this.propertyRepository.save(property);

    // Guardar las instalaciones de esta propiedad
    if (installationsData) {
      // Crear las instalaciones en la base de datos y asociarlas a la propiedad
      const installations = installationsData.map((installation) =>
        this.installationRepository.create({ ...installation, property }),
      );
      await this.installationRepository.save(installations);
    }

    // The notification is a side effect: if it fails, the property is already
    // saved, so failing the request would only make the client retry and
    // create a duplicate.
    try {
      await this.notificationService.createRegistrationNotification(
        actorUserId,
        'property',
        property.id,
        property,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create registration notification for property ${property.id}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    return property;
  }

  async update(id: number, propertyData: UpdatePropertyDto): Promise<Property> {
    // Buscar la propiedad con sus relaciones necesarias
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: [
        'classification',
        'user',
        'installations',
        'insurances',
        'plans',
        'renteds',
        'writings',
      ],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const {
      installations,
      classification: classificationId,
      user: userId,
      ...propertyFields
    } = propertyData;

    // Un id de instalacion ajeno a esta propiedad nunca se pisa ni se mueve.
    const ownedIds = property.installations.map((i) => i.id);
    if (
      installations?.some((i) => i.id !== undefined && !ownedIds.includes(i.id))
    ) {
      throw new BadRequestException(
        'Installation does not belong to this property',
      );
    }

    // Verificar la nueva clasificación
    let classificationToSave: Classification | null = null;
    if (classificationId) {
      classificationToSave = await this.classificationRepository.findOne({
        where: { id: classificationId },
      });

      if (!classificationToSave) {
        throw new NotFoundException('Classification not found');
      }
    }

    let userToSave: User | null = null;
    if (userId !== undefined) {
      userToSave = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!userToSave) {
        throw new NotFoundException('Responsible user not found');
      }
    }

    const fieldsToUpdate: Partial<Property> = {
      ...(propertyFields as Partial<Property>),
      ...(classificationToSave ? { classification: classificationToSave } : {}),
      ...(userToSave ? { user: userToSave } : {}),
    };

    // Todo en una sola transaccion: si falla la sincronizacion de las
    // instalaciones, tampoco quedan guardados los campos de la propiedad.
    await this.propertyRepository.manager.transaction(async (manager) => {
      // TypeORM rechaza un update sin valores, por eso solo se envia si hay campos.
      if (Object.keys(fieldsToUpdate).length > 0) {
        await manager.update(Property, id, fieldsToUpdate);
      }

      // Instalaciones: con id se actualizan, sin id se crean y las que no
      // vienen en el payload se eliminan. Si no vienen, no se tocan.
      if (!installations) {
        return;
      }

      const sentIds = new Set(
        installations.filter((i) => i.id !== undefined).map((i) => i.id),
      );
      const removedIds = ownedIds.filter((existing) => !sentIds.has(existing));

      if (removedIds.length > 0) {
        await manager.delete(Installation, removedIds);
      }

      for (const { id: installationId, ...fields } of installations) {
        if (installationId !== undefined) {
          await manager.update(Installation, installationId, fields);
        } else {
          await manager.save(
            manager.create(Installation, { ...fields, property: { id } }),
          );
        }
      }
    });

    // Retornar la propiedad actualizada con relaciones
    const updatedProperty = await this.propertyRepository.findOne({
      where: { id },
      relations: [
        'classification',
        'user',
        'installations',
        'insurances',
        'plans',
        'renteds',
        'writings',
      ],
    });

    if (!updatedProperty) {
      throw new InternalServerErrorException(
        'Error retrieving updated property',
      );
    }

    return updatedProperty;
  }

  async remove(id: number): Promise<void> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    await this.notificationRepository.delete({ property: { id } });
    await this.installationRepository.delete({ property: { id } });
    await this.insuranceRepository.delete({ property: { id } });
    await this.planRepository.delete({ property: { id } });
    await this.rentedRepository.delete({ property: { id } });
    await this.writingRepository.delete({ property: { id } });
    await this.propertyRepository.delete(id);
  }
}
