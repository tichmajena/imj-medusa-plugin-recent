import { defineLink } from "@medusajs/framework/utils";
import RecentModule from "../modules/recent";
import CustomerModule from "@medusajs/medusa/customer";

export default defineLink(
  {
    linkable: RecentModule.linkable.recentPosts.id,
    field: "customer_id",
    isList: true,
  },
  CustomerModule.linkable.customer,
  {
    readOnly: true,
  },
);
