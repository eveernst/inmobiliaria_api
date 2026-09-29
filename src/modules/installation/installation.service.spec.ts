import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InstallationService } from './installation.service';
import { Installation } from './entities/installation.entity';
import { Classification } from '../classification/entities/classification.entity';
import { Property } from '../property/entities/property.entity';
import { NotificationService } from '../notification/notification.service';

describe('InstallationService.create', () => {
  const installationRepository = {
    create: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<Repository<Installation>>;
  const classificationRepository = {
    findOne: jest.fn(),
  } as unknown as jest.Mocked<Repository<Classification>>;
  const propertyRepository = {
    findOne: jest.fn(),
  } as unknown as jest.Mocked<Repository<Property>>;
  const notificationService = {
    createRegistrationNotification: jest.fn(),
  } as unknown as jest.Mocked<NotificationService>;
  const service = new InstallationService(
    installationRepository,
    classificationRepository,
    propertyRepository,
    notificationService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('associates the installation and notification with its property', async () => {
    const classification = { id: 4 } as Classification;
    const property = { id: 9 } as Property;
    const installation = { id: 12, property } as Installation;
    const data = {
      name: 'Gas',
      quantity: 1,
      details: 'Boiler',
      classificationId: 4,
      propertyId: 9,
    };

    classificationRepository.findOne.mockResolvedValue(classification);
    propertyRepository.findOne.mockResolvedValue(property);
    installationRepository.create.mockReturnValue(installation);
    installationRepository.save.mockResolvedValue(installation);

    await expect(service.create(data, 7)).resolves.toBe(installation);

    expect(installationRepository.create).toHaveBeenCalledWith({
      ...data,
      classification,
      property,
    });
    expect(
      notificationService.createRegistrationNotification,
    ).toHaveBeenCalledWith(7, 'installation', 12, property);
  });

  it('returns the saved installation when the registration notification fails', async () => {
    const logError = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    const property = { id: 9 } as Property;
    const installation = { id: 12, property } as Installation;

    classificationRepository.findOne.mockResolvedValue({
      id: 4,
    } as Classification);
    propertyRepository.findOne.mockResolvedValue(property);
    installationRepository.create.mockReturnValue(installation);
    installationRepository.save.mockResolvedValue(installation);
    notificationService.createRegistrationNotification.mockRejectedValue(
      new Error('column "sourceType" does not exist'),
    );

    await expect(
      service.create(
        {
          name: 'Gas',
          quantity: 1,
          details: 'Boiler',
          classificationId: 4,
          propertyId: 9,
        },
        7,
      ),
    ).resolves.toBe(installation);

    expect(installationRepository.save).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith(
      expect.stringContaining('installation 12'),
      expect.any(String),
    );

    logError.mockRestore();
  });
});
