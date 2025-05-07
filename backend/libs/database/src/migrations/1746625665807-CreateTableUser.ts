import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTableUser1746625665807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "user" (
        "id"         uuid           not null,
        "updated_at" timestamptz(3) not null default current_timestamp(3),
        "created_at" timestamptz(3) not null default current_timestamp(3),
        "removed_at" timestamptz(3)     null,
        "email"      varchar(100)   not null,
        "role"       role           not null,
        --
        unique      ("email"),
        primary key ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table "user";  
    `);
  }
}
