import { Migration } from '@mikro-orm/migrations';

export class Migration20250704233945 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "bio" varchar(255) null, add column "location" varchar(255) null, add column "website" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "bio", drop column "location", drop column "website";`);
  }

}
