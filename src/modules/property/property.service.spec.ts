import { Logger } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PropertyService } from './property.service';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { Classification } from '../classification/entities/classification.entity';
import { NotificationService } from '../notification/notification.service';

describe('PropertyService.findAll', () => {
  const repository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  } as unknown as jest.Mocked<Repository<Property>>;

  const service = new PropertyService(
    repository,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the existing repository query when no filters are provided', async () => {
    repository.find.mockResolvedValue([]);

    await expect(service.findAll()).resolves.toEqual([]);

    expect(repository.find).toHaveBeenCalledWith({
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
    expect(repository.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('combines all provided filters in the database query', async () => {
    const query = {
      leftJoinAndSelect: jest.fn(),
      andWhere: jest.fn(),
      getMany: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<SelectQueryBuilder<Property>>;

    query.leftJoinAndSelect.mockReturnValue(query);
    query.andWhere.mockReturnValue(query);
    repository.createQueryBuilder.mockReturnValue(query);

    await expect(
      service.findAll({
        province: 'Córdoba',
        classification: '3',
        state: '1',
        address: 'Centro',
      }),
    ).resolves.toEqual([]);

    expect(query.andWhere).toHaveBeenCalledWith(
      'LOWER(property.province) LIKE LOWER(:province)',
      { province: '%Córdoba%' },
    );
    expect(query.andWhere).toHaveBeenCalledWith(
      'LOWER(property.address) LIKE LOWER(:address)',
      { address: '%Centro%' },
    );
    expect(query.andWhere).toHaveBeenCalledWith(
      'classification.id = :classificationId',
      { classificationId: 3 },
    );
    expect(query.andWhere).toHaveBeenCalledWith('property.state = :state', {
      state: 1,
    });
    expect(query.getMany).toHaveBeenCalledTimes(1);
  });

  it('returns an empty array for an invalid state filter', async () => {
    await expect(service.findAll({ state: 'invalid' })).resolves.toEqual([]);

    expect(repository.createQueryBuilder).not.toHaveBeenCalled();
  });
});

describe('PropertyService.create', () => {
  const propertyRepository = {
    create: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<Repository<Property>>;
  const classificationRepository = {
    findOne: jest.fn(),
  } as unknown as jest.Mocked<Repository<Classification>>;
  const notificationService = {
    createRegistrationNotification: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;

  const service = new PropertyService(
    propertyRepository,
    classificationRepository,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    notificationService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the saved property when the registration notification fails', async () => {
    const logError = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    const classification = { id: 3 } as Classification;
    const property = { id: 21 } as Property;

    classificationRepository.findOne.mockResolvedValue(classification);
    propertyRepository.create.mockReturnValue(property);
    propertyRepository.save.mockResolvedValue(property);
    notificationService.createRegistrationNotification.mockRejectedValue(
      new Error('column "sourceType" does not exist'),
    );

    await expect(
      service.create({ classification: 3 } as CreatePropertyDto, 7),
    ).resolves.toBe(property);

    expect(propertyRepository.save).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith(
      expect.stringContaining('property 21'),
      expect.any(String),
    );

    logError.mockRestore();
  });
});
