import { BadRequestException, Type, ValidationPipe } from '@nestjs/common';
import { CreateInstallationDto } from './installation/dtos/create-installation.dto';
import { UpdateInstallationDto } from './installation/dtos/update-installation.dto';
import { CreatePlanDto } from './plan-record/dtos/create-plan.dto';
import { UpdatePlanDto } from './plan-record/dtos/update-plan.dto';
import { CreatePropertyDto } from './property/dtos/create-property.dto';
import { UpdatePropertyDto } from './property/dtos/update-property.dto';
import { CreateRentedDto } from './rented-record/dtos/create-rented.dto';
import { UpdateRentedDto } from './rented-record/dtos/update-rented.dto';
import { CreateWritingDto } from './writing-record/dtos/create-writing.dto';
import { UpdateWritingDto } from './writing-record/dtos/update-writing.dto';

// No numeric field accepts a negative value (issue #84). The front blocks it in
// the forms, but the API must not trust the client. Zero stays valid.

// Same options as the global pipe in main.ts.
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
  province: 'Córdoba',
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

const propertyPayload = {
  goodUseCode: '1234567',
  destiny: '5',
  state: '0',
  province: 'Entre Ríos',
  locality: 'Paraná',
  address: 'Av. Siempre Viva 742',
  postalCode: 3103,
  betweenStreets1: 'Calle A',
  betweenStreets2: 'Calle B',
  district: 'Centro',
  active: false,
  clfc: '0',
  detailsMaintenance: 'None',
  description: 'Test property',
  file: '',
  classification: 2,
  user: '7',
  installations: [{ name: 'Gas', quantity: 1, details: 'Boiler', file: '' }],
};

const installationPayload = {
  name: 'Gas',
  quantity: 1,
  details: 'Boiler',
  propertyId: 2,
};

type Case = [string, Type<unknown>, Type<unknown>, object, string[]];

const cases: Case[] = [
  [
    'property',
    CreatePropertyDto,
    UpdatePropertyDto,
    propertyPayload,
    ['goodUseCode', 'postalCode', 'destiny', 'state'],
  ],
  [
    'installation',
    CreateInstallationDto,
    UpdateInstallationDto,
    installationPayload,
    ['quantity'],
  ],
  ['rented', CreateRentedDto, UpdateRentedDto, rentedPayload, ['price']],
  [
    'plan',
    CreatePlanDto,
    UpdatePlanDto,
    planPayload,
    ['planNumber', 'year', 'planNumberUpdate', 'yearUpdate', 'numberVisado'],
  ],
  [
    'writing',
    CreateWritingDto,
    UpdateWritingDto,
    writingPayload,
    [
      'writingNumber',
      'voteNumberJDAAC',
      'voteNumberJDUA',
      'year',
      'totalSurface',
      'coveredSurface',
      'improvementSurface',
      'improvementValue',
    ],
  ],
];

const mentions = (errors: string[], field: string) =>
  errors.some((message) => message.startsWith(`${field} `));

describe.each(cases)(
  '%s DTOs reject negative numbers',
  (_n, Create, Update, payload, fields) => {
    it('the baseline payload is valid', async () => {
      expect(await errorsFor(Create, payload)).toEqual([]);
    });

    describe.each(fields)('%s', (field) => {
      it('create: -1 is rejected', async () => {
        const errors = await errorsFor(Create, { ...payload, [field]: -1 });
        expect(mentions(errors, field)).toBe(true);
      });

      it('create: 0 is accepted', async () => {
        const errors = await errorsFor(Create, { ...payload, [field]: 0 });
        expect(mentions(errors, field)).toBe(false);
      });

      it('update: -1 is rejected', async () => {
        const errors = await errorsFor(Update, { [field]: -1 });
        expect(mentions(errors, field)).toBe(true);
      });
    });
  },
);

describe('installations nested in a property', () => {
  it('create: a negative quantity is rejected', async () => {
    const errors = await errorsFor(CreatePropertyDto, {
      ...propertyPayload,
      installations: [{ name: 'Gas', quantity: -1, details: 'x' }],
    });
    expect(mentions(errors, 'installations.0.quantity')).toBe(true);
  });

  it('update: a negative quantity is rejected', async () => {
    const errors = await errorsFor(UpdatePropertyDto, {
      installations: [{ id: 3, name: 'Gas', quantity: -1, details: 'x' }],
    });
    expect(mentions(errors, 'installations.0.quantity')).toBe(true);
  });
});
