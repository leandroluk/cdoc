import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTableSso1746626187789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "sso" (
        "id"         uuid           not null,
        "updated_at" timestamptz(3) not null default current_timestamp(3),
        "created_at" timestamptz(3) not null default current_timestamp(3),
        "provider"   provider       not null,
        "key"        varchar(50)    not null default '',
        "user_id"    uuid           not null,
        --
        unique      ("user_id"),
        primary key ("id"),
        foreign key ("user_id") references "user" ("id") on delete cascade on update cascade
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table "sso";  
    `);
  }
}
