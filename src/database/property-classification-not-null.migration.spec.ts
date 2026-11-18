import { getMetadataArgsStorage, QueryRunner } from 'typeorm';
import { PropertyClassificationNotNull1793100000000 } from './migrations/1793100000000-PropertyClassificationNotNull';
import { Property } from '../modules/property/entities/property.entity';

// Lives outside migrations/ on purpose: the migration globs load every file
// in that folder.
describe('PropertyClassificationNotNull migration (issue #75)', () => {
  const run = async (direction: 'up' | 'down') => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = {
      connection: { options: {} },
      query,
    } as unknown as QueryRunner;
    await new PropertyClassificationNotNull1793100000000()[direction](
      queryRunner,
    );
    return query.mock.calls.map(([sql]) => sql as string);
  };

  // A plain statement on purpose: if some property still has no
  // classification, Postgres fails the migration instead of recording a
  // no-op as applied (see migrations.spec.ts).
  it('makes the classification column NOT NULL', async () => {
    expect(await run('up')).toEqual([
      'ALTER TABLE "public"."property" ALTER COLUMN "classificationId" SET NOT NULL',
    ]);
  });

  it('down makes the column nullable again', async () => {
    expect(await run('down')).toEqual([
      'ALTER TABLE "public"."property" ALTER COLUMN "classificationId" DROP NOT NULL',
    ]);
  });

  it('declares the Property.classification relation as not nullable', () => {
    const relation = getMetadataArgsStorage().relations.find(
      (r) => r.target === Property && r.propertyName === 'classification',
    );

    expect(relation?.options.nullable).toBe(false);
  });
});
