import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { RECENT_FIELDS } from "./constants";
import { deleteRecentItemStep } from "./steps/delete-recent-item";
import { retrieveCustomerRecentStep } from "./steps/retrieve-customer-recent";
import { validateRecentItemInCollectionStep } from "./steps/validate-recent-item-in-collection";

type DeleteRecentItemWorkflowInput = {
  recent_id: string;
  item_id: string;
  customer_id: string;
};

export const deleteRecentItemWorkflow = createWorkflow(
  "delete-recent-item",
  function (input: DeleteRecentItemWorkflowInput) {
    const recent = retrieveCustomerRecentStep({
      recent_id: input.recent_id,
      customer_id: input.customer_id,
    });

    const recentItem = validateRecentItemInCollectionStep({
      recent,
      item_id: input.item_id,
    });

    deleteRecentItemStep({ recent_item_id: recentItem.id });

    const { data: recents } = useQueryGraphStep({
      entity: "recent_posts",
      fields: RECENT_FIELDS,
      filters: {
        id: recent.id,
      },
    }).config({ name: "refetch-recent" });

    return new WorkflowResponse({
      recent: recents[0],
    });
  },
);
