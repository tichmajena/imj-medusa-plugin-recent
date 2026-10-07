import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261005184920 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "recent_post" drop constraint if exists "recent_post_recent_id_item_id_item_type_unique";`,
    );
    this.addSql(`drop index if exists "IDX_recent_post_recent_id_unique";`);

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recent_post_recent_id_item_id_item_type_unique" ON "recent_post" ("recent_id", "item_id", "item_type") WHERE deleted_at IS NULL;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_recent_post_recent_id_item_id_item_type_unique";`,
    );

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recent_post_recent_id_unique" ON "recent_post" ("recent_id") WHERE deleted_at IS NULL;`,
    );
  }
}
