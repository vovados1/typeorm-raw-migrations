import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745953787526 implements MigrationInterface {
    name = 'Migration1745953787526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "name" integer NOT NULL`);
    }

}
