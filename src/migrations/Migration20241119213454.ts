import { Migration } from '@mikro-orm/migrations';

export class Migration20241119213454 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "role" varchar(255) not null default 'user', "created_at" timestamptz not null, "updated_at" timestamptz null, constraint "user_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );
  }
}
