import { BadRequestException, Type, ValidationPipe } from '@nestjs/common';
import { InsuranceController } from './insurance-record/insurance.controller';
import { InsuranceService } from './insurance-record/insurance.service';
import { UpdateInsuranceDto } from './insurance-record/dtos/update-insurance.dto';
import { PlanController } from './plan-record/plan.controller';
import { PlanService } from './plan-record/plan.service';
import { UpdatePlanDto } from './plan-record/dtos/update-plan.dto';
import { RentedController } from './rented-record/rented.controller';
import { RentedService } from './rented-record/rented.service';
import { UpdateRentedDto } from './rented-record/dtos/update-rented.dto';
import { WritingController } from './writing-record/writing.controller';
import { WritingService } from './writing-record/writing.service';
import { UpdateWritingDto } from './writing-record/dtos/update-writing.dto';

// Same options as the global pipe in main.ts (issue #5, document PUTs).
const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const errorsFor = async (
  metatype: Type<unknown>,
  body: object,
): Promise<string[]> => {
  try {
    await pipe.transform(body, { type: 'body', metatype });
    return [];
  } catch (error) {
    if (!(error instanceof BadRequestException)) {
      throw error;
    }
    return (error.getResponse() as { message: string[] }).message;
  }
};

type DocumentUpdate = {
  name: string;
  Controller: Type<unknown>;
  UpdateDto: Type<unknown>;
  partialBody: object;
  wrongType: { field: string; value: unknown; message: string };
};

const documentUpdates: DocumentUpdate[] = [
  {
    name: 'insurance',
    Controller: InsuranceController,
    UpdateDto: UpdateInsuranceDto,
    partialBody: { observations: 'Renewed' },
    wrongType: {
      field: 'insuranceARM',
      value: 'yes',
      message: 'insuranceARM must be a boolean value',
    },
  },
  {
    name: 'plans',
    Controller: PlanController,
    UpdateDto: UpdatePlanDto,
    partialBody: { planType: 'Gas' },
    wrongType: {
      field: 'planNumber',
      value: 'abc',
      message:
        'planNumber must be a number conforming to the specified constraints',
    },
  },
  {
    name: 'rented',
    Controller: RentedController,
    UpdateDto: UpdateRentedDto,
    partialBody: { price: 180000 },
    wrongType: {
      field: 'contratEndDate',
      value: 'not-a-date',
      message: 'contratEndDate must be a valid date in YYYY-MM-DD format',
    },
  },
  {
    name: 'writing',
    Controller: WritingController,
    UpdateDto: UpdateWritingDto,
    partialBody: { domain: 'Updated domain' },
    wrongType: {
      field: 'year',
      value: 'abc',
      message: 'year must be a number conforming to the specified constraints',
    },
  },
];

describe.each(documentUpdates)(
  'PUT /$name/:id body',
  ({ Controller, UpdateDto, partialBody, wrongType }) => {
    it('is validated with its Update DTO, not Partial<Entity>', () => {
      const [, bodyType] = Reflect.getMetadata(
        'design:paramtypes',
        Controller.prototype,
        'update',
      );

      expect(bodyType).toBe(UpdateDto);
    });

    it('accepts a partial body', async () => {
      await expect(errorsFor(UpdateDto, partialBody)).resolves.toEqual([]);
    });

    it('rejects a wrong type', async () => {
      const errors = await errorsFor(UpdateDto, {
        [wrongType.field]: wrongType.value,
      });

      expect(errors).toContain(wrongType.message);
    });

    it.each(['propertyId', 'id', 'property', 'createdAt'])(
      'rejects %s',
      async (field) => {
        const errors = await errorsFor(UpdateDto, { [field]: 1 });

        expect(errors).toContain(`property ${field} should not exist`);
      },
    );
  },
);

describe.each([
  ['plans', UpdatePlanDto, 'dateVisado'],
  ['rented', UpdateRentedDto, 'contratStartDate'],
  ['writing', UpdateWritingDto, 'voteDateJDAAC'],
] as const)('PUT /%s/:id dates', (_, UpdateDto, field) => {
  it(`keeps ${field} as the 'YYYY-MM-DD' string`, async () => {
    const dto = await pipe.transform(
      { [field]: '2025-02-03' },
      { type: 'body', metatype: UpdateDto },
    );

    expect(dto[field]).toBe('2025-02-03');
  });
});

// An empty body passes the Update DTO (every field is optional), but
// TypeORM's update() throws UpdateValuesMissingError on it: a 500.
describe.each([
  ['insurance', InsuranceService],
  ['plans', PlanService],
  ['rented', RentedService],
  ['writing', WritingService],
] as const)('PUT /%s/:id with an empty body', (_, Service) => {
  const repository = { update: jest.fn(), findOne: jest.fn() };
  const service = new Service(repository as any, {} as any);

  it('returns the record without updating it', async () => {
    const record = { id: 5 };
    repository.findOne.mockResolvedValue(record);

    await expect(service.update(5, {})).resolves.toBe(record);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
