import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { PropertyFiltersDto } from './property-filters.dto';

// Same options as the global pipe in main.ts.
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

  it('rejects a province outside the AAC list (requirement 14)', async () => {
    await expect(validate({ province: 'Buenos Aires' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a partial province name now that the filter is exact', async () => {
    await expect(validate({ province: 'Córd' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
