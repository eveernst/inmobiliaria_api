import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { UpdatePropertyDto } from './update-property.dto';

// Same options as the global pipe in main.ts.
const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const validate = (body: object): Promise<UpdatePropertyDto> =>
  pipe.transform(body, { type: 'body', metatype: UpdatePropertyDto });

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

// The edit payload the property form sends since front #29: only the 17
// editable fields. Existing installations carry their id; their classification
// may be missing because GET /property/:id doesn't load it yet (#47).
const editPayload = {
  goodUseCode: '1234567',
  destiny: '5',
  state: '1',
  province: 'Córdoba',
  locality: 'Córdoba',
  address: 'Av. Colón 1234',
  postalCode: 5000,
  betweenStreets1: 'Calle A',
  betweenStreets2: 'Calle B',
  district: 'Centro',
  active: true,
  clfc: '1',
  detailsMaintenance: 'None',
  description: 'Edited property',
  file: 'https://example.com/property.jpg',
  classification: 2,
  installations: [
    { id: 7, name: 'Gas', quantity: 2, file: '', details: 'Boiler' },
    { name: 'Agua', quantity: 1, details: 'Tank', classification: 3 },
  ],
};

describe('UpdatePropertyDto with the global ValidationPipe', () => {
  it('accepts the edit payload and converts <select> values to numbers', async () => {
    const dto = await validate(editPayload);

    expect(dto.goodUseCode).toBe(1234567);
    expect(dto.destiny).toBe(5);
    expect(dto.state).toBe(1);
  });

  it('accepts a payload with only some fields', async () => {
    await expect(errorsFor({ description: 'Only this' })).resolves.toEqual([]);
  });

  it.each(['id', 'insurances', 'plans', 'renteds', 'writings', 'user'])(
    'rejects the read-only key %s',
    async (field) => {
      const errors = await errorsFor({ ...editPayload, [field]: 1 });

      expect(errors).toContain(`property ${field} should not exist`);
    },
  );

  it('rejects a string where a number is expected', async () => {
    const errors = await errorsFor({ ...editPayload, postalCode: 'abc' });

    expect(errors).toContain(
      'postalCode must be a number conforming to the specified constraints',
    );
  });

  it('rejects a File serialized as {} in the image field', async () => {
    const errors = await errorsFor({ ...editPayload, file: {} });

    expect(errors).toContain('file must be a string');
  });

  it('rejects a province outside the AAC list', async () => {
    const errors = await errorsFor({ ...editPayload, province: 'Salta' });

    expect(errors).toEqual([expect.stringContaining('province')]);
  });

  describe('installations', () => {
    const withInstallation = (installation: object) => ({
      ...editPayload,
      installations: [{ ...editPayload.installations[0], ...installation }],
    });

    it('keeps the id of an existing installation', async () => {
      const dto = await validate(editPayload);

      expect(dto.installations[0].id).toBe(7);
      expect(dto.installations[1].id).toBeUndefined();
    });

    it.each([1.5, '7'])('rejects a non-integer id (%p)', async (id) => {
      const errors = await errorsFor(withInstallation({ id }));

      expect(errors).toContain('installations.0.id must be an integer number');
    });

    it.each([undefined, null])(
      'accepts a missing classification (%p)',
      async (classification) => {
        await expect(
          errorsFor(withInstallation({ classification })),
        ).resolves.toEqual([]);
      },
    );

    it('rejects a non-numeric classification', async () => {
      const errors = await errorsFor(withInstallation({ classification: 'x' }));

      expect(errors).toContain(
        'installations.0.classification must be a number conforming to the specified constraints',
      );
    });

    it('still requires the installation fields', async () => {
      const errors = await errorsFor(withInstallation({ name: '  ' }));

      expect(errors).toContain('installations.0.ERR_NAME_IS_REQUIRED');
    });

    it('rejects unknown fields inside an installation', async () => {
      const errors = await errorsFor(withInstallation({ propertyId: 9 }));

      expect(errors).toContain(
        'installations.0.property propertyId should not exist',
      );
    });
  });
});
