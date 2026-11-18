import { MigrationInterface, QueryRunner } from 'typeorm';

// Issue #75: the data dictionary says property.classificationId is NOT NULL
// and the service already requires it. Plain statement on purpose: if a
// legacy row still has no classification, Postgres fails the migration with
// "column contains null values" instead of silently skipping it.
// Before deploying, check: SELECT count(*) FROM property WHERE "classificationId" IS NULL;
export class PropertyClassificationNotNull1793100000000
  implements MigrationInterface
{
  name = 'PropertyClassificationNotNull1793100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `ALTER TABLE "${schema}"."property" ALTER COLUMN "classificationId" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `ALTER TABLE "${schema}"."property" ALTER COLUMN "classificationId" DROP NOT NULL`,
    );
  }
}
