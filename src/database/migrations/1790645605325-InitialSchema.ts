import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1790645605325 implements MigrationInterface {
  name = 'InitialSchema1790645605325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${schema}"."installation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "quantity" integer NOT NULL, "file" character varying(512), "details" character varying(500) NOT NULL, "propertyId" integer, "classificationId" integer, CONSTRAINT "PK_f0cd0b17a45357b5e1da1da1680" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${schema}"."classification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, CONSTRAINT "PK_1dc9176492b73104aa3d19ccff4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${schema}"."notification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "message" character varying(100) NOT NULL, "type" character varying(100) NOT NULL, "date" TIMESTAMP NOT NULL, "propertyId" integer, "userId" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${schema}"."plan" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "generalPlan" boolean NOT NULL, "planNumber" integer NOT NULL, "year" integer NOT NULL, "planImage" character varying(1024), "profesional" character varying NOT NULL, "professionalContact" character varying NOT NULL, "numberVisado" integer NOT NULL, "dateVisado" TIMESTAMP NOT NULL, "structurePlan" boolean NOT NULL, "structureImage" character varying(1024), "gasPlan" boolean NOT NULL, "gasImage" character varying(1024), "waterPlan" boolean NOT NULL, "waterImage" character varying(1024), "lightPlan" boolean NOT NULL, "lightImage" character varying(1024), "projectPlan" boolean NOT NULL, "projectImage" character varying(1024), "finalPlan" boolean NOT NULL, "finalImage" character varying(1024), "planType" character varying NOT NULL, "planNumberUpdate" integer NOT NULL, "yearUpdate" integer NOT NULL, "stateImage" character varying(1024), "imageVisado" character varying(1024), "formalities" character varying NOT NULL, "documentation" character varying NOT NULL, "contacts" character varying NOT NULL, "propertyId" integer, CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${schema}"."rented" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerDetails" character varying(100) NOT NULL, "affectation" character varying(100) NOT NULL, "ownerContact" character varying(100) NOT NULL, "renterDetails" character varying(100) NOT NULL, "address" character varying(100) NOT NULL, "renterContact" character varying(100) NOT NULL, "locality" character varying(100) NOT NULL, "contratStartDate" TIMESTAMP NOT NULL, "contratEndDate" TIMESTAMP NOT NULL, "province" character varying(100) NOT NULL, "price" integer NOT NULL, "adjustmentType" character varying(100) NOT NULL, "contractImage" character varying(1024), "propertyId" integer, CONSTRAINT "PK_5f5fbe000f77a646b3d1ae3bd8a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${schema}"."writing" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "writingNumber" integer NOT NULL, "voteNumberJDAAC" integer NOT NULL, "voteDateJDAAC" TIMESTAMP NOT NULL, "imageJDAAC" character varying(1024), "voteNumberJDUA" integer NOT NULL, "voteDateJDUA" TIMESTAMP NOT NULL, "imageJDUA" character varying(1024), "domain" character varying NOT NULL, "folio" character varying NOT NULL, "tomo" character varying NOT NULL, "year" integer NOT NULL, "department" character varying NOT NULL, "totalSurface" integer NOT NULL, "coveredSurface" integer NOT NULL, "improvementSurface" integer NOT NULL, "improvementValue" integer NOT NULL, "cadastralNomenclature" character varying NOT NULL, "ubicationMap" character varying(1024), "cadastralInform" character varying(1024), "actingNotary" character varying NOT NULL, "notaryContact" integer NOT NULL, "interiorImage" character varying(1024), "exteriorImage" character varying(1024), "formalities" character varying NOT NULL, "documentation" character varying NOT NULL, "detailSpaces" character varying NOT NULL, "propertyId" integer, CONSTRAINT "PK_d29831aa609e46c9364b1dbe7e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${schema}"."insurance" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "phone" bigint NOT NULL, "email" character varying NOT NULL, "insuredProperty" character varying NOT NULL, "insuranceARM" boolean NOT NULL, "insuranceASE" boolean NOT NULL, "team" boolean NOT NULL, "content" boolean NOT NULL, "values" boolean NOT NULL, "insuranceLink" character varying(1024), "insuranceImage" character varying(1024), "insuranceDate" TIMESTAMP NOT NULL, "AnualFormLink" character varying(1024), "AnualFormImage" character varying(1024), "AnualFormDate" TIMESTAMP NOT NULL, "observations" character varying NOT NULL, "propertyId" integer, CONSTRAINT "UQ_d682bfd5b77cc3f64c2281ae370" UNIQUE ("phone"), CONSTRAINT "UQ_9574aa3621a010a97280e9ab2a5" UNIQUE ("email"), CONSTRAINT "PK_07152a21fd75ea211dcea53e3c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${schema}"."property" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "goodUseCode" integer NOT NULL, "file" character varying(512), "province" character varying(100) NOT NULL, "locality" character varying(100) NOT NULL, "address" character varying(100) NOT NULL, "postalCode" integer NOT NULL, "betweenStreets1" character varying(100) NOT NULL, "betweenStreets2" character varying(100) NOT NULL, "district" character varying(100) NOT NULL, "destiny" integer NOT NULL, "state" integer NOT NULL, "active" boolean NOT NULL, "clfc" character varying NOT NULL, "detailsMaintenance" character varying(500) NOT NULL, "description" character varying(500) NOT NULL, "userId" integer, "classificationId" integer, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "${schema}"."user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'installation',
      'FK_6faa44c4ee309ae876993aac4a0',
      `FOREIGN KEY ("propertyId") REFERENCES "${schema}"."property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'installation',
      'FK_5a78b3a24bdbb8e0743bbc200a0',
      `FOREIGN KEY ("classificationId") REFERENCES "${schema}"."classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'notification',
      'FK_66ea6088c78ffdd4f7b52ae7c5c',
      `FOREIGN KEY ("propertyId") REFERENCES "${schema}"."property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'notification',
      'FK_1ced25315eb974b73391fb1c81b',
      `FOREIGN KEY ("userId") REFERENCES "${schema}"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'plan',
      'FK_02937d7b0f2b95973de968a1aff',
      `FOREIGN KEY ("propertyId") REFERENCES "${schema}"."property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'rented',
      'FK_8ec7eeb9ff427cc5d816a5d77da',
      `FOREIGN KEY ("propertyId") REFERENCES "${schema}"."property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'writing',
      'FK_3bc61dedf5bd272a8b2834870f8',
      `FOREIGN KEY ("propertyId") REFERENCES "${schema}"."property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'insurance',
      'FK_67de034213778cd9d4d7007ae42',
      `FOREIGN KEY ("propertyId") REFERENCES "${schema}"."property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'property',
      'FK_d90007b39cfcf412e15823bebc1',
      `FOREIGN KEY ("userId") REFERENCES "${schema}"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await this.addConstraintIfMissing(
      queryRunner,
      schema,
      'property',
      'FK_4795c54e22bce5b46f6af3ac97c',
      `FOREIGN KEY ("classificationId") REFERENCES "${schema}"."classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `ALTER TABLE "${schema}"."property" DROP CONSTRAINT "FK_4795c54e22bce5b46f6af3ac97c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."property" DROP CONSTRAINT "FK_d90007b39cfcf412e15823bebc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."insurance" DROP CONSTRAINT "FK_67de034213778cd9d4d7007ae42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."writing" DROP CONSTRAINT "FK_3bc61dedf5bd272a8b2834870f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."rented" DROP CONSTRAINT "FK_8ec7eeb9ff427cc5d816a5d77da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."plan" DROP CONSTRAINT "FK_02937d7b0f2b95973de968a1aff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."notification" DROP CONSTRAINT "FK_66ea6088c78ffdd4f7b52ae7c5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."installation" DROP CONSTRAINT "FK_5a78b3a24bdbb8e0743bbc200a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."installation" DROP CONSTRAINT "FK_6faa44c4ee309ae876993aac4a0"`,
    );
    await queryRunner.query(`DROP TABLE "${schema}"."user"`);
    await queryRunner.query(`DROP TABLE "${schema}"."property"`);
    await queryRunner.query(`DROP TABLE "${schema}"."insurance"`);
    await queryRunner.query(`DROP TABLE "${schema}"."writing"`);
    await queryRunner.query(`DROP TABLE "${schema}"."rented"`);
    await queryRunner.query(`DROP TABLE "${schema}"."plan"`);
    await queryRunner.query(`DROP TABLE "${schema}"."notification"`);
    await queryRunner.query(`DROP TABLE "${schema}"."classification"`);
    await queryRunner.query(`DROP TABLE "${schema}"."installation"`);
  }

  // The shared database already has this schema (built by `synchronize`
  // before migrations existed), with the same constraint names. Postgres has
  // no ADD CONSTRAINT IF NOT EXISTS, so check pg_constraint first.
  private async addConstraintIfMissing(
    queryRunner: QueryRunner,
    schema: string,
    table: string,
    name: string,
    definition: string,
  ): Promise<void> {
    await queryRunner.query(
      `DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
           WHERE conname = '${name}'
             AND connamespace = '${schema}'::regnamespace
        ) THEN
          ALTER TABLE "${schema}"."${table}" ADD CONSTRAINT "${name}" ${definition};
        END IF;
      END $$`,
    );
  }
}
