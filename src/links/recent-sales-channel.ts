import { defineLink } from "@medusajs/framework/utils";
import RecentModule from "../modules/recent";
import SalesChannelModule from "@medusajs/medusa/sales-channel";

export default defineLink(
  {
    linkable: RecentModule.linkable.recentPosts.id,
    field: "sales_channel_id",
  },
  SalesChannelModule.linkable.salesChannel,
  {
    readOnly: true,
  },
);
