import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { UpdateInstallationDto } from './update-installation.dto';

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
      metatype: UpdateInstallationDto,
    });
    return [];
  } catch (error) {
    if (!(error instanceof BadRequestException)) {
      throw error;
    }
    return (error.getResponse() as { message: string[] }).message;
  }
};

describe('UpdateInstallationDto with the global ValidationPipe', () => {
  it('accepts a partial body', async () => {
    await expect(errorsFor({ quantity: 3 })).resolves.toEqual([]);
  });

  it('accepts an empty body', async () => {
    await expect(errorsFor({})).resolves.toEqual([]);
  });

  it('rejects a wrong type', async () => {
    const errors = await errorsFor({ name: 5 });

    expect(errors).toContain('name must be a string');
  });

  it.each(['id', 'property', 'propertyId', 'classification', 'createdAt'])(
    'rejects the read-only key %s',
    async (field) => {
      const errors = await errorsFor({ name: 'Gas', [field]: 1 });

      expect(errors).toContain(`property ${field} should not exist`);
    },
  );
});
