import { z } from "@medusajs/framework/zod";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const PostStoreCreateRecent = z.object({
  post_type: z.string().trim().min(1).max(100),
});

export type PostStoreCreateRecentType = z.infer<typeof PostStoreCreateRecent>;

export const PostStoreCreateRecentItem = z.object({
  title: z.string().trim().min(1).max(255),
  item_id: z.string().trim().min(1).max(255),
  item_type: z.string().trim().min(1).max(100),
});

export type PostStoreCreateRecentItemType = z.infer<
  typeof PostStoreCreateRecentItem
>;

export const GetStoreRecentsParams = createFindParams({
  limit: 20,
  offset: 0,
}).extend({
  post_type: z.string().trim().min(1).max(100).optional(),
});

export type GetStoreRecentsParamsType = z.infer<typeof GetStoreRecentsParams>;
