import { applyDecorators } from '@nestjs/common';
import { IsDateString, Matches } from 'class-validator';

const message = '$property must be a valid date in YYYY-MM-DD format';

/**
 * A calendar date as `<input type="date">` sends it: `'YYYY-MM-DD'`, strict.
 * The value stays a string so TypeORM stores that literal date. Converting it
 * to a Date (e.g. with `@Type(() => Date)`) would mean UTC midnight, which the
 * `timestamp` columns store in the server's time zone: a day earlier west of
 * UTC (#46). The proper fix, `date` columns, is tracked in #56.
 */
export function IsCalendarDate(): PropertyDecorator {
  return applyDecorators(
    Matches(/^\d{4}-\d{2}-\d{2}$/, { message }),
    IsDateString({ strict: true }, { message }),
  );
}
