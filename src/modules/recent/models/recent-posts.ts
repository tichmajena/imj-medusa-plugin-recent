import { model } from "@medusajs/framework/utils";
import { RecentPost } from "./recent-post";

export const RecentPosts = model
  .define("recent_posts", {
    id: model.id().primaryKey(),
    customer_id: model.text(),
    sales_channel_id: model.text(),
    post_type: model.text(),
    items: model.hasMany(() => RecentPost, {
      mappedBy: "recent",
    }),
  })
  .cascades({
    delete: ["items"],
  })
  .indexes([
    {
      on: ["customer_id", "post_type"],
      unique: true,
    },
  ]);
