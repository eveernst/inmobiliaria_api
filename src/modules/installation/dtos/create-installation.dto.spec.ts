import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateInstallationDto } from './create-installation.dto';

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
      metatype: CreateInstallationDto,
    });
    return [];
  } catch (error) {
    if (!(error instanceof BadRequestException)) {
      throw error;
    }
    return (error.getResponse() as { message: string[] }).message;
  }
};

const payload = { name: 'Gas', quantity: 1, details: 'Boiler', propertyId: 9 };

describe('CreateInstallationDto with the global ValidationPipe', () => {
  it('accepts an installation without classification or file', async () => {
    await expect(errorsFor(payload)).resolves.toEqual([]);
  });

  it('rejects classificationId (#47)', async () => {
    const errors = await errorsFor({ ...payload, classificationId: 4 });

    expect(errors).toContain('property classificationId should not exist');
  });
});
