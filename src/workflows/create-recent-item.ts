import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { RECENT_FIELDS } from "./constants";
import { createRecentItemStep } from "./steps/create-recent-item";
import { retrieveCustomerRecentStep } from "./steps/retrieve-customer-recent";
import { validateRecentItemNotExistsStep } from "./steps/validate-recent-item-not-exists";

type CreateRecentItemWorkflowInput = {
  recent_id: string;
  customer_id: string;
  title: string;
  item_id: string;
  item_type: string;
};

export const createRecentItemWorkflow = createWorkflow(
  "create-recent-item",
  function (input: CreateRecentItemWorkflowInput) {
    const recent = retrieveCustomerRecentStep({
      recent_id: input.recent_id,
      customer_id: input.customer_id,
    });

    validateRecentItemNotExistsStep({
      recent,
      item_id: input.item_id,
      item_type: input.item_type,
    });

    createRecentItemStep({
      recent_id: recent.id,
      title: input.title,
      item_id: input.item_id,
      item_type: input.item_type,
    });

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
