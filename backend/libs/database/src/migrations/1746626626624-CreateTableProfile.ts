import {ETheme} from '@cdoc/domain';
import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateTableProfile1746626626624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "profile" (
        "id"          uuid           not null,
        "updated_at"  timestamptz(3) not null default current_timestamp(3),
        "given_name"  varchar(100)       null,
        "family_name" varchar(100)       null,
        "picture"     text               null,
        "cover"       text               null,
        "locale"      varchar(10)    not null default 'pt-BR',
        "theme"       theme          not null default '${ETheme.Light}',
        "timezone"    varchar(50)    not null default 'UTC',
        "user_id"     uuid           not null,
        --
        unique      ("user_id"),
        primary key ("id"),
        foreign key ("user_id") references "user" ("id") on delete cascade on update cascade
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table "profile";  
    `);
  }
}
