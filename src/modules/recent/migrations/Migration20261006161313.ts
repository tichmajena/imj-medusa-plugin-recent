import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261006161313 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "recent_posts" drop constraint if exists "recent_posts_customer_id_post_type_unique";`,
    );
    this.addSql(
      `alter table if exists "recent_post" drop constraint if exists "recent_post_recent_id_foreign";`,
    );

    this.addSql(
      `drop index if exists "IDX_recent_posts_customer_id_sales_channel_id_unique";`,
    );

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recent_posts_customer_id_post_type_unique" ON "recent_posts" ("customer_id", "post_type") WHERE deleted_at IS NULL;`,
    );

    this.addSql(
      `alter table if exists "recent_post" add constraint "recent_post_recent_id_foreign" foreign key ("recent_id") references "recent_posts" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "recent_post" drop constraint if exists "recent_post_recent_id_foreign";`,
    );

    this.addSql(
      `drop index if exists "IDX_recent_posts_customer_id_post_type_unique";`,
    );

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recent_posts_customer_id_sales_channel_id_unique" ON "recent_posts" ("customer_id", "sales_channel_id") WHERE deleted_at IS NULL;`,
    );

    this.addSql(
      `alter table if exists "recent_post" add constraint "recent_post_recent_id_foreign" foreign key ("recent_id") references "recent_posts" ("id") on update cascade;`,
    );
  }
}
