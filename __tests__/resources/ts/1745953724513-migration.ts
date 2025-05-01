import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745953724513 implements MigrationInterface {
    name = 'Migration1745953724513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "job"`);
    }

}
