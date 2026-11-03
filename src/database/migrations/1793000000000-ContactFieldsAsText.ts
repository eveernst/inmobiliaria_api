import { MigrationInterface, QueryRunner } from 'typeorm';

// Issue #54: contact numbers were stored as numbers, so a notary phone like
// 3510000045 overflowed integer, and the unique constraints on the insurance
// phone and email stopped two policies from sharing a contact. They become
// text and the constraints are dropped; existing values are cast to text.
//
// Constraint names come from the InitialSchema migration
// (1790645605325-InitialSchema.ts, CREATE TABLE "insurance").
const INSURANCE_PHONE_UNIQUE = 'UQ_d682bfd5b77cc3f64c2281ae370';
const INSURANCE_EMAIL_UNIQUE = 'UQ_9574aa3621a010a97280e9ab2a5';

export class ContactFieldsAsText1793000000000 implements MigrationInterface {
  name = 'ContactFieldsAsText1793000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `ALTER TABLE "${schema}"."insurance" DROP CONSTRAINT "${INSURANCE_PHONE_UNIQUE}"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."insurance" DROP CONSTRAINT "${INSURANCE_EMAIL_UNIQUE}"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."insurance" ALTER COLUMN "phone" TYPE character varying USING "phone"::text`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."writing" ALTER COLUMN "notaryContact" TYPE character varying USING "notaryContact"::text`,
    );
  }

  // Only reversible while the data still fits the old schema: the casts fail
  // on non-numeric or out-of-range values, and re-adding the unique
  // constraints fails on duplicates. Either way the transaction rolls back.
  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `ALTER TABLE "${schema}"."writing" ALTER COLUMN "notaryContact" TYPE integer USING "notaryContact"::integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."insurance" ALTER COLUMN "phone" TYPE bigint USING "phone"::bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."insurance" ADD CONSTRAINT "${INSURANCE_PHONE_UNIQUE}" UNIQUE ("phone")`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."insurance" ADD CONSTRAINT "${INSURANCE_EMAIL_UNIQUE}" UNIQUE ("email")`,
    );
  }
}
