import { MigrationInterface, QueryRunner } from 'typeorm';

// Issue #47: installations no longer have a classification. Drops the column
// and its foreign key; the stored values are discarded on purpose.
export class RemoveInstallationClassification1792800000000
  implements MigrationInterface
{
  name = 'RemoveInstallationClassification1792800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `ALTER TABLE "${schema}"."installation" DROP CONSTRAINT "FK_5a78b3a24bdbb8e0743bbc200a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."installation" DROP COLUMN "classificationId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `ALTER TABLE "${schema}"."installation" ADD "classificationId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."installation" ADD CONSTRAINT "FK_5a78b3a24bdbb8e0743bbc200a0" FOREIGN KEY ("classificationId") REFERENCES "${schema}"."classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
