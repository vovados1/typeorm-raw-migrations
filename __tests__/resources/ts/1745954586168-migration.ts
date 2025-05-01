import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745954586168 implements MigrationInterface {
    name = 'Migration1745954586168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id")`);
    }

}
