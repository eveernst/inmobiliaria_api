import { Transform } from 'class-transformer';

/**
 * Converts numeric strings (e.g. values from an HTML `<select>`) to numbers
 * before validation. Blank strings are left untouched on purpose, so that
 * `@IsNumber()` rejects them: a plain `@Type(() => Number)` would turn `''`
 * into `0` and let an empty field through.
 */
export function ToNumber(): PropertyDecorator {
  return Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? Number(value) : value,
  );
}
