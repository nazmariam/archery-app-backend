import { Migration } from '@mikro-orm/migrations';

export class Migration20250706113141_AddResetPasswordFields extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "user" add column "reset_password_token" varchar(255) null, add column "reset_password_expires" timestamptz null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "user" drop column "reset_password_token", drop column "reset_password_expires";`,
    );
  }
}
