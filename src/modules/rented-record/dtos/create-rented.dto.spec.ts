import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateRentedDto } from './create-rented.dto';
import { UpdateRentedDto } from './update-rented.dto';

// Same options as the global pipe in main.ts.
const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const validate = (metatype: object, body: object) =>
  pipe.transform(body, { type: 'body', metatype: metatype as never });

const validRented = {
  ownerDetails: 'Owner',
  affectation: 'Housing',
  ownerContact: '',
  renterDetails: 'Renter',
  address: 'Main St 1',
  renterContact: '',
  locality: 'Paraná',
  contratStartDate: '2026-01-01',
  contratEndDate: '2027-01-01',
  province: 'Entre Ríos',
  price: 1000,
  adjustmentType: 'ICL',
  propertyId: 1,
};

describe('Rented province (requirement 14, issue #49)', () => {
  it.each(['Córdoba', 'Santa Fe', 'Entre Ríos'])(
    'accepts the AAC province %s on create',
    async (province) => {
      await expect(
        validate(CreateRentedDto, { ...validRented, province }),
      ).resolves.toBeDefined();
    },
  );

  it.each(['Cordoba', 'Entre Rios', 'Buenos Aires'])(
    'rejects %s on create',
    async (province) => {
      await expect(
        validate(CreateRentedDto, { ...validRented, province }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it('rejects a province outside the list on update', async () => {
    await expect(
      validate(UpdateRentedDto, { province: 'Cordoba' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('still allows an update that does not send the province', async () => {
    await expect(
      validate(UpdateRentedDto, { price: 2000 }),
    ).resolves.toBeDefined();
  });
});
