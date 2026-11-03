import { Transform } from 'class-transformer';

/**
 * Turns a number into its string form before validation, so contact fields
 * (phone numbers) stored as text still accept a client that sends a number.
 * Anything else is left untouched for `@IsString()` to judge.
 */
export function NumberToText(): PropertyDecorator {
  return Transform(({ value }) =>
    typeof value === 'number' ? String(value) : value,
  );
}
