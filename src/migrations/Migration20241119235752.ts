import { Migration } from '@mikro-orm/migrations';

export class Migration20241119235752 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_email_unique";`);

    this.addSql(
      `alter table "user" add column "auth_provider" varchar(255) not null default 'local', add column "picture" varchar(255) null;`,
    );
    this.addSql(
      `alter table "user" alter column "password" type varchar(255) using ("password"::varchar(255));`,
    );
    this.addSql(`alter table "user" alter column "password" drop not null;`);
    this.addSql(`alter table "user" alter column "role" drop default;`);
    this.addSql(
      `alter table "user" alter column "role" type varchar(255) using ("role"::varchar(255));`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "user" drop column "auth_provider", drop column "picture";`,
    );

    this.addSql(
      `alter table "user" alter column "role" type varchar(255) using ("role"::varchar(255));`,
    );
    this.addSql(`alter table "user" alter column "role" set default 'user';`);
    this.addSql(
      `alter table "user" alter column "password" type varchar(255) using ("password"::varchar(255));`,
    );
    this.addSql(`alter table "user" alter column "password" set not null;`);
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );
  }
}
