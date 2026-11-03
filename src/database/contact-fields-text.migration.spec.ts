import { QueryRunner, getMetadataArgsStorage } from 'typeorm';
import { ContactFieldsAsText1793000000000 } from './migrations/1793000000000-ContactFieldsAsText';
import { Insurance } from '../modules/insurance-record/entities/insurance.entity';
import { Writing } from '../modules/writing-record/entities/writing.entity';

// Lives outside migrations/ on purpose: the migration globs load every file
// in that folder.
describe('ContactFieldsAsText migration (issue #54)', () => {
  const run = async (direction: 'up' | 'down') => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = {
      connection: { options: {} },
      query,
    } as unknown as QueryRunner;
    await new ContactFieldsAsText1793000000000()[direction](queryRunner);
    return query.mock.calls.map(([sql]) => sql as string);
  };

  it('drops both unique constraints, then casts the contact columns to text', async () => {
    expect(await run('up')).toEqual([
      'ALTER TABLE "public"."insurance" DROP CONSTRAINT "UQ_d682bfd5b77cc3f64c2281ae370"',
      'ALTER TABLE "public"."insurance" DROP CONSTRAINT "UQ_9574aa3621a010a97280e9ab2a5"',
      'ALTER TABLE "public"."insurance" ALTER COLUMN "phone" TYPE character varying USING "phone"::text',
      'ALTER TABLE "public"."writing" ALTER COLUMN "notaryContact" TYPE character varying USING "notaryContact"::text',
    ]);
  });

  it('down casts back and restores the unique constraints', async () => {
    expect(await run('down')).toEqual([
      'ALTER TABLE "public"."writing" ALTER COLUMN "notaryContact" TYPE integer USING "notaryContact"::integer',
      'ALTER TABLE "public"."insurance" ALTER COLUMN "phone" TYPE bigint USING "phone"::bigint',
      'ALTER TABLE "public"."insurance" ADD CONSTRAINT "UQ_d682bfd5b77cc3f64c2281ae370" UNIQUE ("phone")',
      'ALTER TABLE "public"."insurance" ADD CONSTRAINT "UQ_9574aa3621a010a97280e9ab2a5" UNIQUE ("email")',
    ]);
  });

  describe('entities match the migrated schema', () => {
    const column = (target: unknown, name: string) =>
      getMetadataArgsStorage().columns.find(
        (c) => c.target === target && c.propertyName === name,
      );

    it.each([
      [Insurance, 'phone'],
      [Insurance, 'email'],
      [Writing, 'notaryContact'],
    ])('%p.%s is a plain string column without unique', (entity, name) => {
      const options = column(entity, name)?.options;

      expect(options?.unique).toBeFalsy();
      expect(options?.type).toBe(String); // reflected design type: varchar
    });
  });
});
