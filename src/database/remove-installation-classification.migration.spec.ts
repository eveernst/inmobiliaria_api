import { QueryRunner } from 'typeorm';
import { RemoveInstallationClassification1792800000000 } from './migrations/1792800000000-RemoveInstallationClassification';

// Lives outside migrations/ on purpose: the migration globs load every file
// in that folder.
describe('RemoveInstallationClassification migration (issue #47)', () => {
  const run = async (direction: 'up' | 'down') => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = {
      connection: { options: {} },
      query,
    } as unknown as QueryRunner;
    await new RemoveInstallationClassification1792800000000()[direction](
      queryRunner,
    );
    return query.mock.calls.map(([sql]) => sql as string);
  };

  it('drops the foreign key and then the column', async () => {
    expect(await run('up')).toEqual([
      'ALTER TABLE "public"."installation" DROP CONSTRAINT "FK_5a78b3a24bdbb8e0743bbc200a0"',
      'ALTER TABLE "public"."installation" DROP COLUMN "classificationId"',
    ]);
  });

  it('down restores the nullable column and its foreign key', async () => {
    expect(await run('down')).toEqual([
      'ALTER TABLE "public"."installation" ADD "classificationId" integer',
      'ALTER TABLE "public"."installation" ADD CONSTRAINT "FK_5a78b3a24bdbb8e0743bbc200a0" FOREIGN KEY ("classificationId") REFERENCES "public"."classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    ]);
  });
});
