import {ETheme} from '@cdoc/domain';
import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTypeTheme1746626545853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create type "theme" as enum (
        '${ETheme.Light}',
        '${ETheme.Dark}',
        '${ETheme.System}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop type "theme";
    `);
  }
}
