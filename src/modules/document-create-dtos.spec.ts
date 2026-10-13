import { BadRequestException, Type, ValidationPipe } from '@nestjs/common';
import { CreatePlanDto } from './plan-record/dtos/create-plan.dto';
import { CreateRentedDto } from './rented-record/dtos/create-rented.dto';
import { CreateWritingDto } from './writing-record/dtos/create-writing.dto';
import { CreateInsuranceDto } from './insurance-record/dtos/create-insurance.dto';
import { CreatePropertyDto } from './property/dtos/create-property.dto';

// Same options as the global pipe in main.ts (issue #45).
const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const validate = <T>(metatype: Type<T>, body: object): Promise<T> =>
  pipe.transform(body, { type: 'body', metatype });

const errorsFor = async (
  metatype: Type<unknown>,
  body: object,
): Promise<string[]> => {
  try {
    await validate(metatype, body);
    return [];
  } catch (error) {
    if (!(error instanceof BadRequestException)) {
      throw error;
    }
    return (error.getResponse() as { message: string[] }).message;
  }
};

// Payloads in the shape each document form sends: dates from
// <input type="date"> as 'YYYY-MM-DD', optional text inputs as '', and
// images only when one was uploaded.
const planPayload = {
  generalPlan: true,
  structurePlan: false,
  gasPlan: false,
  waterPlan: false,
  lightPlan: false,
  projectPlan: false,
  finalPlan: false,
  planNumber: 12,
  year: 2020,
  professional: 'Arq. Pérez',
  professionalContact: '3511234567',
  planType: 'General',
  planNumberUpdate: 13,
  yearUpdate: 2024,
  formalities: 'Approved',
  documentation: 'Complete',
  contacts: 'Municipality',
  numberVisado: 55,
  dateVisado: '2024-05-10',
  propertyId: 2,
};

const rentedPayload = {
  ownerDetails: '',
  affectation: 'Habitacional',
  ownerContact: '',
  renterDetails: '',
  address: '',
  renterContact: '',
  locality: '',
  contratStartDate: '2026-01-01',
  province: 'Cordoba',
  contratEndDate: '2027-01-01',
  price: 150000,
  adjustmentType: '',
  propertyId: 2,
};

const writingPayload = {
  writingNumber: 101,
  voteNumberJDAAC: 7,
  voteDateJDAAC: '2023-03-01',
  voteNumberJDUA: 8,
  voteDateJDUA: '2023-04-01',
  domain: '',
  folio: '',
  tomo: '',
  year: 2023,
  department: '',
  totalSurface: 500,
  coveredSurface: 200,
  improvementSurface: 50,
  improvementValue: 1000000,
  cadastralNomenclature: '',
  ubicationMap: '',
  cadastralInform: '',
  actingNotary: '',
  notaryContact: 3511234567,
  formalities: '',
  documentation: '',
  detailSpaces: '',
  propertyId: 2,
};

const insurancePayload = {
  name: 'Seguros SA',
  phone: '3511234567',
  email: 'contact@seguros.example',
  insuredProperty: 'Terreno',
  insuranceARM: true,
  insuranceASE: false,
  team: false,
  content: false,
  values: false,
  observations: '',
  propertyId: 2,
};

describe('Document Create DTOs with the global ValidationPipe', () => {
  describe('propertyId', () => {
    it.each([
      ['CreatePlanDto', CreatePlanDto, planPayload],
      ['CreateRentedDto', CreateRentedDto, rentedPayload],
      ['CreateWritingDto', CreateWritingDto, writingPayload],
      ['CreateInsuranceDto', CreateInsuranceDto, insurancePayload],
    ] as const)('%s rejects a missing propertyId', async (_, dto, payload) => {
      const withoutProperty: object = { ...payload, propertyId: undefined };

      const errors = await errorsFor(dto, withoutProperty);

      expect(errors).toContain('ERR_PROPERTYID_IS_REQUIRED');
    });

    it.each([
      ['CreatePlanDto', CreatePlanDto, planPayload],
      ['CreateRentedDto', CreateRentedDto, rentedPayload],
      ['CreateWritingDto', CreateWritingDto, writingPayload],
      ['CreateInsuranceDto', CreateInsuranceDto, insurancePayload],
    ] as const)(
      '%s rejects a non-integer propertyId',
      async (_, dto, payload) => {
        const errors = await errorsFor(dto, { ...payload, propertyId: 2.5 });

        expect(errors).toContain('propertyId must be an integer number');
      },
    );
  });

  describe('CreatePlanDto', () => {
    it('accepts the form payload and converts dateVisado to a Date', async () => {
      const dto = await validate(CreatePlanDto, planPayload);

      expect(dto.dateVisado).toEqual(new Date('2024-05-10'));
    });

    it('accepts images that are missing or removed', async () => {
      await expect(
        errorsFor(CreatePlanDto, {
          ...planPayload,
          planImage: 'https://example.com/plan.jpg',
          gasImage: '',
        }),
      ).resolves.toEqual([]);
    });

    it.each(['', 'not-a-date'])(
      'rejects an invalid dateVisado (%p)',
      async (dateVisado) => {
        const errors = await errorsFor(CreatePlanDto, {
          ...planPayload,
          dateVisado,
        });

        expect(errors).toContain('dateVisado must be a Date instance');
      },
    );
  });

  describe('CreateRentedDto', () => {
    it('accepts the form payload and converts both dates', async () => {
      const dto = await validate(CreateRentedDto, rentedPayload);

      expect(dto.contratStartDate).toEqual(new Date('2026-01-01'));
      expect(dto.contratEndDate).toEqual(new Date('2027-01-01'));
    });

    it('accepts a contract image when one was uploaded', async () => {
      await expect(
        errorsFor(CreateRentedDto, {
          ...rentedPayload,
          contractImage: 'https://example.com/contract.pdf',
        }),
      ).resolves.toEqual([]);
    });

    it('still requires the optional text fields to be sent, even empty', async () => {
      const withoutOwner: object = {
        ...rentedPayload,
        ownerDetails: undefined,
      };

      const errors = await errorsFor(CreateRentedDto, withoutOwner);

      expect(errors).toContain('ownerDetails must be a string');
    });

    // NOT NULL columns: the form must ask for them (front change).
    it.each(['contratStartDate', 'contratEndDate'])(
      'rejects an empty %s',
      async (field) => {
        const errors = await errorsFor(CreateRentedDto, {
          ...rentedPayload,
          [field]: '',
        });

        expect(errors).toContain(`${field} must be a Date instance`);
      },
    );

    it('rejects a missing price', async () => {
      const errors = await errorsFor(CreateRentedDto, {
        ...rentedPayload,
        price: null,
      });

      expect(errors).toContain('ERR_PRICE_IS_REQUIRED');
    });
  });

  describe('CreateWritingDto', () => {
    it('accepts the form payload and converts both vote dates', async () => {
      const dto = await validate(CreateWritingDto, writingPayload);

      expect(dto.voteDateJDAAC).toEqual(new Date('2023-03-01'));
      expect(dto.voteDateJDUA).toEqual(new Date('2023-04-01'));
    });

    it('accepts images that are missing or removed', async () => {
      await expect(
        errorsFor(CreateWritingDto, {
          ...writingPayload,
          imageJDAAC: 'https://example.com/jdaac.jpg',
          interiorImage: '',
        }),
      ).resolves.toEqual([]);
    });

    it.each(['voteDateJDAAC', 'voteDateJDUA'])(
      'rejects an empty %s',
      async (field) => {
        const errors = await errorsFor(CreateWritingDto, {
          ...writingPayload,
          [field]: '',
        });

        expect(errors).toContain(`${field} must be a Date instance`);
      },
    );

    // NOT NULL columns: the form must ask for them (front change).
    it.each([
      'year',
      'totalSurface',
      'coveredSurface',
      'improvementSurface',
      'improvementValue',
      'notaryContact',
    ])('rejects a missing %s', async (field) => {
      const errors = await errorsFor(CreateWritingDto, {
        ...writingPayload,
        [field]: null,
      });

      expect(errors).toContain(`ERR_${field.toUpperCase()}_IS_REQUIRED`);
    });
  });

  describe('CreatePropertyDto numeric fields', () => {
    it.each([
      ['postalCode', '5000', 5000],
      ['classification', '2', 2],
    ])('converts a numeric string %s', async (field, sent, expected) => {
      const dto = await validate(CreatePropertyDto, {
        goodUseCode: 1234567,
        province: 'Córdoba',
        locality: 'Córdoba',
        address: 'Av. Colón 1234',
        postalCode: 5000,
        betweenStreets1: 'Calle A',
        betweenStreets2: 'Calle B',
        district: 'Centro',
        destiny: 3,
        state: 0,
        active: true,
        clfc: '0',
        detailsMaintenance: 'None',
        description: 'Test property',
        classification: 2,
        [field]: sent,
      });

      expect(dto[field as keyof CreatePropertyDto]).toBe(expected);
    });
  });
});
