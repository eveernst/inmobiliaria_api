import { MigrationInterface, QueryRunner } from 'typeorm';

// Issue #49: rented rows were saved with free-text provinces (the rented form
// sent 'Cordoba' and 'Entre Rios' without accents). Rewrite every known
// spelling to the canonical AAC list in src/shared/constants/provinces.ts.
// Rows with any other value are left untouched on purpose.
const CANONICAL: [string, string[]][] = [
  ['Córdoba', ['cordoba', 'córdoba']],
  ['Santa Fe', ['santa fe']],
  ['Entre Ríos', ['entre rios', 'entre ríos']],
];

export class NormalizeRentedProvince1792368000000
  implements MigrationInterface
{
  name = 'NormalizeRentedProvince1792368000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    for (const [province, spellings] of CANONICAL) {
      await queryRunner.query(
        `UPDATE "${schema}"."rented" SET "province" = $1 WHERE LOWER(TRIM("province")) = ANY($2)`,
        [province, spellings],
      );
    }
  }

  public async down(): Promise<void> {
    // Not reversible: the original spelling of each row isn't recorded, and
    // the canonical values are valid data. Intentionally a no-op.
  }
}
