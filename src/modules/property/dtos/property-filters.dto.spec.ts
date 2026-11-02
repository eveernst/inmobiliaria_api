import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PropertyFiltersDto } from './property-filters.dto';

describe('PropertyFiltersDto', () => {
  it('transforms numeric query parameters into numbers', () => {
    const filters = plainToInstance(PropertyFiltersDto, {
      state: '1',
      classification: '2',
    });

    expect(filters.state).toBe(1);
    expect(filters.classification).toBe(2);
  });

  it('rejects a non-integer state filter', async () => {
    const filters = plainToInstance(PropertyFiltersDto, { state: 'abc' });

    const errors = await validate(filters);

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'state',
          constraints: expect.objectContaining({ isInt: expect.any(String) }),
        }),
      ]),
    );
  });

  it('rejects classification names because classification means an id', async () => {
    const filters = plainToInstance(PropertyFiltersDto, {
      classification: 'Residential',
    });

    const errors = await validate(filters);

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'classification',
          constraints: expect.objectContaining({ isInt: expect.any(String) }),
        }),
      ]),
    );
  });
});
