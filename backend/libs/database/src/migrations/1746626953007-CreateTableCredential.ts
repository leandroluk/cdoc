import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTableCredential1746626953007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "credential" (
        "id"         uuid           not null,
        "updated_at" timestamptz(3) not null default current_timestamp(3),
        "password"   text           not null,
        "is_active"  boolean        not null default false,
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
      drop table "credential";  
    `);
  }
}
