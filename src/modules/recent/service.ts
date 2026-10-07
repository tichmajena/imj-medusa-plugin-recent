import { MedusaService } from "@medusajs/framework/utils";
import { RecentPosts } from "./models/recent-posts";
import { RecentPost } from "./models/recent-post";

export default class RecentModuleService extends MedusaService({
  RecentPosts,
  RecentItem: RecentPost,
}) {}
