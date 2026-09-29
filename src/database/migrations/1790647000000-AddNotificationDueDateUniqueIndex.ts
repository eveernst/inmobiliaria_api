import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationDueDateUniqueIndex1790647000000
  implements MigrationInterface
{
  name = 'AddNotificationDueDateUniqueIndex1790647000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_notification_due_date_source_user" ON "${schema}"."notification" ("sourceType", "sourceId", "dueDate", "userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `DROP INDEX "${schema}"."UQ_notification_due_date_source_user"`,
    );
  }
}
