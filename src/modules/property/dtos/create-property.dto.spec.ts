import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreatePropertyDto } from './create-property.dto';

// Same options as the global pipe in main.ts: validating with anything looser
// would hide exactly the regression this spec guards against (issue #33).
const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const validate = (body: object): Promise<CreatePropertyDto> =>
  pipe.transform(body, { type: 'body', metatype: CreatePropertyDto });

const errorsFor = async (body: object): Promise<string[]> => {
  try {
    await validate(body);
    return [];
  } catch (error) {
    if (!(error instanceof BadRequestException)) {
      throw error;
    }
    return (error.getResponse() as { message: string[] }).message;
  }
};

// Real payload captured from the property form (issue #33): <select> values
// arrive as strings, empty inputs as '', nested installations use
// `classification` as a plain id and carry no propertyId.
const formPayload = {
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
  installations: [
    {
      name: 'Gas',
      classification: 1,
      quantity: 2,
      file: '',
      details: 'Boiler',
    },
  ],
};

describe('CreatePropertyDto with the global ValidationPipe', () => {
  it('accepts the form payload and converts <select> values to numbers', async () => {
    const dto = await validate(formPayload);

    expect(dto.goodUseCode).toBe(1234567);
    expect(dto.destiny).toBe(5);
    expect(dto.state).toBe(0);
  });

  it('accepts nested installations in the shape the form sends', async () => {
    const dto = await validate(formPayload);

    expect(dto.installations).toEqual([
      expect.objectContaining({ name: 'Gas', classification: 1, quantity: 2 }),
    ]);
  });

  it('accepts a payload without the optional file', async () => {
    const withoutFile = { ...formPayload };
    delete withoutFile.file;

    await expect(errorsFor(withoutFile)).resolves.toEqual([]);
  });

  it('accepts a payload without installations', async () => {
    const withoutInstallations = { ...formPayload };
    delete withoutInstallations.installations;

    await expect(errorsFor(withoutInstallations)).resolves.toEqual([]);
  });

  it('validates each nested installation', async () => {
    const errors = await errorsFor({
      ...formPayload,
      installations: [{ ...formPayload.installations[0], name: '  ' }],
    });

    expect(errors).toContain('installations.0.ERR_NAME_IS_REQUIRED');
  });

  it('rejects unknown fields inside a nested installation', async () => {
    const errors = await errorsFor({
      ...formPayload,
      installations: [{ ...formPayload.installations[0], propertyId: 9 }],
    });

    expect(errors).toContain(
      'installations.0.property propertyId should not exist',
    );
  });

  it.each(['goodUseCode', 'destiny', 'state'])(
    'rejects a non-numeric %s',
    async (field) => {
      const errors = await errorsFor({ ...formPayload, [field]: 'abc' });

      expect(errors).toContain(
        `${field} must be a number conforming to the specified constraints`,
      );
    },
  );

  it.each(['goodUseCode', 'destiny', 'state'])(
    'rejects an empty %s instead of turning it into 0',
    async (field) => {
      const errors = await errorsFor({ ...formPayload, [field]: '' });

      expect(errors).toContain(
        `${field} must be a number conforming to the specified constraints`,
      );
    },
  );
});
