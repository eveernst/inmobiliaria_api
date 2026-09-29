import { ConfigService } from '@nestjs/config';

export function getJwtSecret(configService: ConfigService): string {
  const jwtSecret = configService.get<string>('JWT_SECRET');

  if (!jwtSecret?.trim()) {
    throw new Error('JWT_SECRET must be configured and non-empty');
  }

  return jwtSecret;
}
