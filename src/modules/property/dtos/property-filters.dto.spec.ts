import 'reflect-metadata';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { PropertyFiltersDto } from './property-filters.dto';

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const validate = (query: object): Promise<PropertyFiltersDto> =>
  pipe.transform(query, { type: 'query', metatype: PropertyFiltersDto });

describe('PropertyFiltersDto with the global ValidationPipe', () => {
  it.each(['Córdoba', 'Santa Fe', 'Entre Ríos'])(
    'accepts the AAC province %s',
    async (province) => {
      await expect(validate({ province })).resolves.toEqual(
        expect.objectContaining({ province }),
      );
    },
  );

  it('accepts a query without province', async () => {
    await expect(validate({})).resolves.toBeDefined();
  });

  it('rejects a province outside the AAC list', async () => {
    await expect(validate({ province: 'Buenos Aires' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a partial province name now that the filter is exact', async () => {
    await expect(validate({ province: 'Córd' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('transforms numeric query parameters into numbers', async () => {
    await expect(
      validate({ state: '1', classification: '2' }),
    ).resolves.toEqual(
      expect.objectContaining({ state: 1, classification: 2 }),
    );
  });

  it('rejects a non-integer state filter', async () => {
    await expect(validate({ state: 'abc' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects classification names because classification means an id', async () => {
    await expect(
      validate({ classification: 'Residential' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
