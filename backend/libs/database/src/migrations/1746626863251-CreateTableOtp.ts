import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTableOtp1746626863251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "otp" (
        "id"         uuid           not null,
        "updated_at" timestamptz(3) not null default current_timestamp(3),
        "expires_at" timestamptz(3) not null,
        "code"       char(6)        not null,
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
      drop table "otp";  
    `);
  }
}
