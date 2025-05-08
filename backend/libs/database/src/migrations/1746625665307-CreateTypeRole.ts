import {ERole} from '@cdoc/domain';
import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTypeRole1746625665307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create type "role" as enum (
        '${ERole.Admin}',
        '${ERole.Guest}',
        '${ERole.Member}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop type "role";
    `);
  }
}
