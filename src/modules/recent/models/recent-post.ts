import { model } from "@medusajs/framework/utils";
import { RecentPosts } from "./recent-posts";

export const RecentPost = model
  .define("recent_post", {
    id: model.id().primaryKey(),
    title: model.text(),
    item_id: model.text(),
    item_type: model.text(),
    recent: model.belongsTo(() => RecentPosts, {
      mappedBy: "items",
    }),
  })
  .indexes([
    {
      on: ["recent_id", "item_id", "item_type"],
      unique: true,
    },
  ]);
