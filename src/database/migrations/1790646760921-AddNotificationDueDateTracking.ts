import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationDueDateTracking1790646760921
  implements MigrationInterface
{
  name = 'AddNotificationDueDateTracking1790646760921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `ALTER TABLE "${schema}"."notification" ADD COLUMN IF NOT EXISTS "sourceType" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."notification" ADD COLUMN IF NOT EXISTS "sourceId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."notification" ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `ALTER TABLE "${schema}"."notification" DROP COLUMN "dueDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."notification" DROP COLUMN "sourceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."notification" DROP COLUMN "sourceType"`,
    );
  }
}
