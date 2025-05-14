import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTableReceivedEmail1746665081774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "received_email" (
        "id"              uuid           not null,
        "created_at"      timestamptz(3) not null default current_timestamp(3),
        "subject"         text           not null,
        "from"            text           not null,
        "to"              text           not null,
        "cc"              text           not null default '',
        "body"            text           not null default '',
        "attachment_list" text           not null default '',
        --
        primary key ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table "received_email";
    `);
  }
}
