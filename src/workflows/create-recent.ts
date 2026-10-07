import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { RECENT_FIELDS } from "./constants";
import { createRecentStep } from "./steps/create-recent";
import { validateCustomerCreateRecentStep } from "./steps/validate-customer-create-recent";

type CreateRecentWorkflowInput = {
  customer_id: string;
  sales_channel_id: string;
  post_type: string;
};

export const createRecentWorkflow = createWorkflow(
  "create-recent",
  function (input: CreateRecentWorkflowInput) {
    validateCustomerCreateRecentStep({
      customer_id: input.customer_id,
      post_type: input.post_type,
    });

    const created = createRecentStep(input);

    const { data: recents } = useQueryGraphStep({
      entity: "recent_posts",
      fields: RECENT_FIELDS,
      filters: {
        id: created.id,
      },
    }).config({ name: "refetch-recent" });

    return new WorkflowResponse({
      recent: recents[0],
    });
  },
);
