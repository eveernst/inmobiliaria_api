import { QueryRunner } from 'typeorm';
import { NormalizeRentedProvince1792368000000 } from './migrations/1792368000000-NormalizeRentedProvince';

// Lives outside migrations/ on purpose: the migration globs load every file
// in that folder.
describe('NormalizeRentedProvince migration (issue #49)', () => {
  const run = async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = {
      connection: { options: {} },
      query,
    } as unknown as QueryRunner;
    await new NormalizeRentedProvince1792368000000().up(queryRunner);
    return query.mock.calls.map(([sql, params]) => ({ sql, params }));
  };

  it('rewrites every known spelling to the canonical AAC province', async () => {
    const statements = await run();

    expect(statements).toEqual([
      {
        sql: expect.stringContaining('UPDATE "public"."rented"'),
        params: ['Córdoba', ['cordoba', 'córdoba']],
      },
      {
        sql: expect.stringContaining('UPDATE "public"."rented"'),
        params: ['Santa Fe', ['santa fe']],
      },
      {
        sql: expect.stringContaining('UPDATE "public"."rented"'),
        params: ['Entre Ríos', ['entre rios', 'entre ríos']],
      },
    ]);
  });

  it('matches case-insensitively and trims spaces', async () => {
    const [first] = await run();

    expect(first.sql).toContain('LOWER(TRIM("province")) = ANY($2)');
  });
});
