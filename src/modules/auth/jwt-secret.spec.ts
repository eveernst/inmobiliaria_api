import { ConfigService } from '@nestjs/config';
import { getJwtSecret } from './jwt-secret';

describe('getJwtSecret', () => {
  it('returns the configured secret', () => {
    const configService = new ConfigService({ JWT_SECRET: 'test-secret' });

    expect(getJwtSecret(configService)).toBe('test-secret');
  });

  it.each([undefined, '', '   '])('rejects an empty secret: %p', (value) => {
    const configService = new ConfigService({ JWT_SECRET: value });

    expect(() => getJwtSecret(configService)).toThrow(
      'JWT_SECRET must be configured and non-empty',
    );
  });
});
