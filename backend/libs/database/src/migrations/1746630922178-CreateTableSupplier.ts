import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTableSupplier1746630922178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "supplier" (
        "id"                        uuid           not null,
        "updated_at"                timestamptz(3) not null default current_timestamp(3),
        "created_at"                timestamptz(3) not null default current_timestamp(3),
        "removed_at"                timestamptz(3)     null,
        "link"                      text           not null,
        "greendocs_doc_id"          integer        not null,
        "greendocs_instance_id"     integer        not null,
        "greendocs_name"            text           not null default '',
        "greendocs_supplier_name"   text           not null default '',
        "greendocs_address"         text           not null default '',
        "greendocs_city"            text           not null default '',
        "greendocs_state"           text           not null default '',
        "greendocs_zip_code"        text           not null default '',
        "greendocs_email"           text           not null default '',
        "greendocs_phone"           text           not null default '',
        "greendocs_responsible"     text           not null default '',
        "greendocs_in_attention_by" text           not null default '',
        "greendocs_situation"       text           not null default '',
        "project_id"                uuid           not null,
        --
        unique      ("greendocs_doc_id"),
        primary key ("id"),
        foreign key ("project_id") references "project" ("id") on update cascade on delete cascade
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table "supplier";  
    `);
  }
}
