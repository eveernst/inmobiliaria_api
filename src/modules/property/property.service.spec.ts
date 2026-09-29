import { Repository, SelectQueryBuilder } from 'typeorm';
import { PropertyService } from './property.service';
import { Property } from './entities/property.entity';

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
