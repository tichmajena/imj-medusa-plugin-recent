import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261005111908 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "recent_post" drop constraint if exists "recent_post_recent_id_unique";`,
    );
    this.addSql(
      `alter table if exists "recent_posts" drop constraint if exists "recent_posts_customer_id_sales_channel_id_unique";`,
    );
    this.addSql(
      `create table if not exists "recent_posts" ("id" text not null, "customer_id" text not null, "sales_channel_id" text not null, "post_type" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recent_posts_pkey" primary key ("id"));`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_recent_posts_deleted_at" ON "recent_posts" ("deleted_at") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recent_posts_customer_id_sales_channel_id_unique" ON "recent_posts" ("customer_id", "sales_channel_id") WHERE deleted_at IS NULL;`,
    );

    this.addSql(
      `create table if not exists "recent_post" ("id" text not null, "title" text not null, "item_id" text not null, "item_type" text not null, "recent_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recent_post_pkey" primary key ("id"));`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_recent_post_recent_id" ON "recent_post" ("recent_id") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_recent_post_deleted_at" ON "recent_post" ("deleted_at") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recent_post_recent_id_unique" ON "recent_post" ("recent_id") WHERE deleted_at IS NULL;`,
    );

    this.addSql(
      `alter table if exists "recent_post" add constraint "recent_post_recent_id_foreign" foreign key ("recent_id") references "recent_posts" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "recent_post" drop constraint if exists "recent_post_recent_id_foreign";`,
    );

    this.addSql(`drop table if exists "recent_posts" cascade;`);

    this.addSql(`drop table if exists "recent_post" cascade;`);
  }
}
