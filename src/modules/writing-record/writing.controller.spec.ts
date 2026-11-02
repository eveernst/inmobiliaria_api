import { WritingController } from './writing.controller';
import { WritingService } from './writing.service';
import { Writing } from './entities/writing.entity';

describe('WritingController', () => {
  const fields = {
    id: 8,
    writingNumber: 321,
    voteNumberJDAAC: 11,
    voteDateJDAAC: new Date('2020-03-01T00:00:00Z'),
    imageJDAAC: 'https://example.com/jdaac.jpg',
    voteNumberJDUA: 12,
    voteDateJDUA: new Date('2020-04-01T00:00:00Z'),
    imageJDUA: 'https://example.com/jdua.jpg',
    domain: 'Dominio 1',
    folio: '100',
    tomo: '7',
    year: 2020,
    department: 'Capital',
    totalSurface: 500,
    coveredSurface: 300,
    improvementSurface: 200,
    improvementValue: 90000,
    cadastralNomenclature: '01-02-03',
    ubicationMap: 'https://example.com/map.jpg',
    cadastralInform: 'https://example.com/cadastral.pdf',
    actingNotary: 'Esc. Gomez',
    notaryContact: 3515550003,
    interiorImage: 'https://example.com/interior.jpg',
    exteriorImage: 'https://example.com/exterior.jpg',
    formalities: 'Done',
    documentation: 'Complete',
    detailSpaces: 'Garage',
  };
  const entity = Object.assign(new Writing(), {
    ...fields,
    createdAt: new Date('2026-09-28T00:00:00Z'),
    updatedAt: new Date('2026-09-28T00:00:00Z'),
    property: {
      id: 1,
      address: 'Av. Colon 1234',
      locality: 'Cordoba',
      province: 'Cordoba',
      user: { id: 1, password: 'hashed-secret' },
    },
  });
  const expected = {
    ...fields,
    property: {
      id: 1,
      address: 'Av. Colon 1234',
      locality: 'Cordoba',
      province: 'Cordoba',
    },
  };

  let service: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  let controller: WritingController;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    controller = new WritingController(service as unknown as WritingService);
  });

  it('findAll returns only the exposed DTO fields', async () => {
    service.findAll.mockResolvedValue([entity]);

    const response = await controller.findAll();

    expect(response.map((w) => ({ ...w }))).toEqual([expected]);
  });

  it('findOne returns only the exposed DTO fields', async () => {
    service.findOne.mockResolvedValue(entity);

    const response = await controller.findOne(8);

    expect({ ...response.data }).toEqual(expected);
  });

  it('create returns only the exposed DTO fields', async () => {
    service.create.mockResolvedValue(entity);

    const response = await controller.create({} as any);

    expect({ ...response }).toEqual(expected);
  });

  it('update returns only the exposed DTO fields', async () => {
    service.update.mockResolvedValue(entity);

    const response = await controller.update(8, {});

    expect({ ...response }).toEqual(expected);
  });
});
