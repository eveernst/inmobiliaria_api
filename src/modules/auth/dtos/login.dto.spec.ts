import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './login.dto';

// Same options as the global pipe in main.ts.
const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const validate = (body: object) =>
  pipe.transform(body, { type: 'body', metatype: LoginDto });

describe('LoginDto with the global ValidationPipe (#48)', () => {
  it('accepts the email and password the front sends', async () => {
    await expect(
      validate({ email: 'admin@aac.com', password: 'secret' }),
    ).resolves.toEqual({ email: 'admin@aac.com', password: 'secret' });
  });

  it.each([
    ['a missing email', { password: 'secret' }],
    ['a malformed email', { email: 'not-an-email', password: 'secret' }],
    ['a missing password', { email: 'admin@aac.com' }],
    ['an empty password', { email: 'admin@aac.com', password: '' }],
    ['an extra field', { email: 'admin@aac.com', password: 'secret', role: 3 }],
  ])('rejects %s with 400', async (_case, body) => {
    await expect(validate(body)).rejects.toBeInstanceOf(BadRequestException);
  });
});
