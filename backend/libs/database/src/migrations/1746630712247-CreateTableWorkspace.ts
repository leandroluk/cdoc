import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTableWorkspace1746630712247 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "workspace" (
        "id"                      uuid           not null,
        "updated_at"              timestamptz(3) not null default current_timestamp(3),
        "created_at"              timestamptz(3) not null default current_timestamp(3),
        "removed_at"              timestamptz(3)     null,
        "link"                    text           not null,
        "submenu_selector"        text               null,
        "suppliers_extraction_at" timestamptz(3)     null,
        "suppliers_view_link"     text               null,
        "reserve_view_link"       text               null,
        "greendocs_id"            integer        not null,
        "greendocs_name"          varchar(100)   not null,
        --
        unique      ("greendocs_id"),
        primary key ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table "workspace";  
    `);
  }
}
