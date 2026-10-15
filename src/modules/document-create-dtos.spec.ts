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
  insuranceDate: '2026-03-01',
  AnualFormDate: '2026-12-01',
  observations: 'None',
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
    it('accepts the form payload and keeps dateVisado as a calendar date', async () => {
      const dto = await validate(CreatePlanDto, planPayload);

      expect(dto.dateVisado).toBe('2024-05-10');
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

        expect(errors).toContain(
          'dateVisado must be a valid date in YYYY-MM-DD format',
        );
      },
    );
  });

  describe('CreateRentedDto', () => {
    it('accepts the form payload and keeps both dates as calendar dates', async () => {
      const dto = await validate(CreateRentedDto, rentedPayload);

      expect(dto.contratStartDate).toBe('2026-01-01');
      expect(dto.contratEndDate).toBe('2027-01-01');
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

        expect(errors).toContain(
          `${field} must be a valid date in YYYY-MM-DD format`,
        );
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
    it('accepts the form payload and keeps both vote dates as calendar dates', async () => {
      const dto = await validate(CreateWritingDto, writingPayload);

      expect(dto.voteDateJDAAC).toBe('2023-03-01');
      expect(dto.voteDateJDUA).toBe('2023-04-01');
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

        expect(errors).toContain(
          `${field} must be a valid date in YYYY-MM-DD format`,
        );
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

  // Required: the due-date scheduler warns on both dates (issue #46).
  describe('CreateInsuranceDto', () => {
    it('accepts the form payload and keeps both dates as calendar dates', async () => {
      const dto = await validate(CreateInsuranceDto, insurancePayload);

      expect(dto.insuranceDate).toBe('2026-03-01');
      expect(dto.AnualFormDate).toBe('2026-12-01');
    });

    // The form omits an empty date instead of sending ''.
    it.each(['insuranceDate', 'AnualFormDate'])(
      'rejects a missing %s',
      async (field) => {
        const errors = await errorsFor(CreateInsuranceDto, {
          ...insurancePayload,
          [field]: undefined,
        });

        expect(errors).toContain(`ERR_${field.toUpperCase()}_IS_REQUIRED`);
      },
    );

    it('accepts empty observations', async () => {
      await expect(
        errorsFor(CreateInsuranceDto, {
          ...insurancePayload,
          observations: '',
        }),
      ).resolves.toEqual([]);
    });

    it('still requires observations to be sent, even empty', async () => {
      const withoutObservations: object = {
        ...insurancePayload,
        observations: undefined,
      };

      const errors = await errorsFor(CreateInsuranceDto, withoutObservations);

      expect(errors).toContain('observations must be a string');
    });

    it.each(['insuranceDate', 'AnualFormDate'])(
      'rejects an invalid %s',
      async (field) => {
        const errors = await errorsFor(CreateInsuranceDto, {
          ...insurancePayload,
          [field]: 'not-a-date',
        });

        expect(errors).toContain(
          `${field} must be a valid date in YYYY-MM-DD format`,
        );
      },
    );
  });

  describe('date fields', () => {
    const dateFields = [
      ['CreatePlanDto', CreatePlanDto, planPayload, 'dateVisado'],
      ['CreateRentedDto', CreateRentedDto, rentedPayload, 'contratStartDate'],
      ['CreateRentedDto', CreateRentedDto, rentedPayload, 'contratEndDate'],
      ['CreateWritingDto', CreateWritingDto, writingPayload, 'voteDateJDAAC'],
      ['CreateWritingDto', CreateWritingDto, writingPayload, 'voteDateJDUA'],
      [
        'CreateInsuranceDto',
        CreateInsuranceDto,
        insurancePayload,
        'insuranceDate',
      ],
      [
        'CreateInsuranceDto',
        CreateInsuranceDto,
        insurancePayload,
        'AnualFormDate',
      ],
    ] as const;

    // A Date would mean UTC midnight, stored a day earlier west of UTC.
    it.each(dateFields)(
      '%s keeps %s as the string the form sent',
      async (_, dto, payload, field) => {
        const result = await validate<object>(dto, {
          ...payload,
          [field]: '2026-03-01',
        });

        expect(result[field]).toBe('2026-03-01');
      },
    );

    it.each(
      dateFields.flatMap((entry) =>
        ['01/03/2026', '2026-3-1', '2026-02-30', '2026-03-01T00:00:00Z'].map(
          (value) => [...entry, value] as const,
        ),
      ),
    )('%s rejects %s = %p', async (_, dto, payload, field, value) => {
      const errors = await errorsFor(dto, { ...payload, [field]: value });

      expect(errors).toContain(
        `${field} must be a valid date in YYYY-MM-DD format`,
      );
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
