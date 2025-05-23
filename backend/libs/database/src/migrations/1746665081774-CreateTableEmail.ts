import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTableEmail1746665081774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "email" (
        "id"              uuid           not null,
        "created_at"      timestamptz(3) not null default current_timestamp(3),
        "subject"         text           not null,
        "body"            text           not null default '',
        "from_list"       text[]         not null default ARRAY[]::text[],
        "to_list"         text[]         not null default ARRAY[]::text[],
        "cc_list"         text[]         not null default ARRAY[]::text[],
        "attachment_list" text[]         not null default ARRAY[]::text[],
        --
        primary key ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table "email";
    `);
  }
}
