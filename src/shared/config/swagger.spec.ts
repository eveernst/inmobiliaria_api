import { isSwaggerEnabled } from './swagger';

describe('isSwaggerEnabled', () => {
  it.each([undefined, 'development', 'test'])(
    'is on outside production (NODE_ENV=%p)',
    (nodeEnv) => {
      expect(isSwaggerEnabled({ NODE_ENV: nodeEnv })).toBe(true);
    },
  );

  it('is off in production by default', () => {
    expect(isSwaggerEnabled({ NODE_ENV: 'production' })).toBe(false);
  });

  it.each(['', 'false', '1', 'yes', 'TRUE '])(
    'stays off in production when ENABLE_SWAGGER=%p',
    (flag) => {
      expect(
        isSwaggerEnabled({ NODE_ENV: 'production', ENABLE_SWAGGER: flag }),
      ).toBe(false);
    },
  );

  it('is on in production only with ENABLE_SWAGGER=true', () => {
    expect(
      isSwaggerEnabled({ NODE_ENV: 'production', ENABLE_SWAGGER: 'true' }),
    ).toBe(true);
  });
});
