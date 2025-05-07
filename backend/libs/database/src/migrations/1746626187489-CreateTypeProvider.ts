import {EProvider} from '@cdoc/domain';
import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTypeProvider1746626187489 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create type "provider" as enum (
        '${EProvider.Microsoft}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop type "provider";
    `);
  }
}
