import {EProvider, ERole, ETheme} from '@cdoc/domain';
import {type MigrationInterface, type QueryRunner} from 'typeorm';
import {uuidv7} from 'uuidv7';

export class SeedUserWithReferences1746665061774 implements MigrationInterface {
  private j = {id: uuidv7(), email: 'john.doe@email.com'};
  private a = {id: uuidv7(), email: 'ada.lovelace@email.com'};
  private password = 'h3bxCOJHqx4rMjBCwEnCZkB8gfutQb3h6N_Bu2b9Jn4'; // encrypted of "Test@123"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // user
    await queryRunner.query(`
      insert into "user" ("id", "updated_at", "created_at", "removed_at", "email", "role") values 
        ('${this.j.id}', now(), now(), null, '${this.j.email}', '${ERole.Member}'),
        ('${this.a.id}', now(), now(), null, '${this.a.email}',  '${ERole.Admin}');
    `);

    // otp
    await queryRunner.query(`
      insert into "otp" ("id", "updated_at", "expires_at", "code", "user_id") values
        ('${uuidv7()}', now(), now(), '123456', '${this.j.id}'),
        ('${uuidv7()}', now(), now(), '123456', '${this.a.id}');
    `);

    // sso
    await queryRunner.query(`
      insert into "sso" ("id", "updated_at", "created_at", "provider", "key", "user_id") values
        ('${uuidv7()}', now(), now(), '${EProvider.Microsoft}', '', '${this.j.id}'),
        ('${uuidv7()}', now(), now(), '${EProvider.Microsoft}', '', '${this.a.id}');
    `);

    // credential
    await queryRunner.query(`
      insert into "credential" ("id" , "updated_at", "password", "is_active", "user_id") values
        ('${uuidv7()}', now(), '${this.password}', true, '${this.j.id}'),
        ('${uuidv7()}', now(), '${this.password}', true, '${this.a.id}');
    `);

    // profile
    await queryRunner.query(`
      insert into "profile" ("id", "updated_at", "given_name", "family_name", "picture", "cover", "locale", "theme", "timezone", "user_id") values
        ('${uuidv7()}', now(), 'John',      'Doe', null, null, 'pt-BR', '${ETheme.Light}',  'UTC', '${this.j.id}'),
        ('${uuidv7()}', now(),  'Ada', 'Lovelace', null, null, 'en-US', '${ETheme.System}', 'UTC', '${this.a.id}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      delete from "user" where "id" in ('${this.j.id}','${this.a.id}') cascade;
    `);
  }
}
