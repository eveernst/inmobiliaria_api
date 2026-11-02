import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { UpdateClassificationDto } from './update-classification.dto';

// Same options as the global pipe in main.ts.
const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const errorsFor = async (body: object): Promise<string[]> => {
  try {
    await pipe.transform(body, {
      type: 'body',
      metatype: UpdateClassificationDto,
    });
    return [];
  } catch (error) {
    if (!(error instanceof BadRequestException)) {
      throw error;
    }
    return (error.getResponse() as { message: string[] }).message;
  }
};

describe('UpdateClassificationDto with the global ValidationPipe', () => {
  it('accepts a new name', async () => {
    await expect(errorsFor({ name: 'Residential' })).resolves.toEqual([]);
  });

  it('accepts an empty body', async () => {
    await expect(errorsFor({})).resolves.toEqual([]);
  });

  it('rejects a non-string name', async () => {
    const errors = await errorsFor({ name: 5 });

    expect(errors).toContain('name must be a string');
  });

  it.each(['id', 'properties', 'installations', 'propertyId'])(
    'rejects the read-only key %s',
    async (field) => {
      const errors = await errorsFor({ name: 'Residential', [field]: 1 });

      expect(errors).toContain(`property ${field} should not exist`);
    },
  );
});
