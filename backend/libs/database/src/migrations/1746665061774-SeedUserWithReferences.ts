import {EProvider, ERole, ETheme} from '@cdoc/domain';
import {type MigrationInterface, type QueryRunner} from 'typeorm';
import {uuidv7} from 'uuidv7';

export class SeedUserWithReferences1746665061774 implements MigrationInterface {
  private johnDoe = {id: '0196cae6-3996-70d8-8fb0-a427d4c382b7', email: 'john.doe@email.com'};
  private adaLove = {id: '0196cae6-3996-70d8-8fb0-a428a6ccd86a', email: 'ada.lovelace@email.com'};
  private password = 'h3bxCOJHqx4rMjBCwEnCZkB8gfutQb3h6N_Bu2b9Jn4'; // encrypted of "Test@123"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // user
    await queryRunner.query(`
      insert into "user" ("id", "updated_at", "created_at", "removed_at", "email", "role") values 
        ('${this.johnDoe.id}', now(), now(), null, '${this.johnDoe.email}', '${ERole.Member}'),
        ('${this.adaLove.id}', now(), now(), null, '${this.adaLove.email}',  '${ERole.Admin}');
    `);

    // otp
    await queryRunner.query(`
      insert into "otp" ("id", "updated_at", "expires_at", "code", "user_id") values
        ('${uuidv7()}', now(), now(), '123456', '${this.johnDoe.id}'),
        ('${uuidv7()}', now(), now(), '123456', '${this.adaLove.id}');
    `);

    // sso
    await queryRunner.query(`
      insert into "sso" ("id", "updated_at", "created_at", "provider", "key", "user_id") values
        ('${uuidv7()}', now(), now(), '${EProvider.Microsoft}', '', '${this.johnDoe.id}'),
        ('${uuidv7()}', now(), now(), '${EProvider.Microsoft}', '', '${this.adaLove.id}');
    `);

    // credential
    await queryRunner.query(`
      insert into "credential" ("id" , "updated_at", "password", "is_active", "user_id") values
        ('${uuidv7()}', now(), '${this.password}', true, '${this.johnDoe.id}'),
        ('${uuidv7()}', now(), '${this.password}', true, '${this.adaLove.id}');
    `);

    // profile
    await queryRunner.query(`
      insert into "profile" ("id", "updated_at", "given_name", "family_name", "picture", "theme", "user_id") values
        ('${uuidv7()}', now(), 'John',      'Doe', null, '${ETheme.Light}',  '${this.johnDoe.id}'),
        ('${uuidv7()}', now(),  'Ada', 'Lovelace', null, '${ETheme.System}', '${this.adaLove.id}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      delete from "user" where "id" in ('${this.johnDoe.id}','${this.adaLove.id}') cascade;
    `);
  }
}
