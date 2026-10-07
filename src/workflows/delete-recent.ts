import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { RECENT_FIELDS } from "./constants";
import { deleteRecentStep } from "./steps/delete-recent";
import { retrieveCustomerRecentStep } from "./steps/retrieve-customer-recent";

type DeleteRecentWorkflowInput = {
  recent_id: string;
  customer_id: string;
};

export const deleteRecentWorkflow = createWorkflow(
  "delete-recent",
  function (input: DeleteRecentWorkflowInput) {
    const recent = retrieveCustomerRecentStep(input);

    const { data: recents } = useQueryGraphStep({
      entity: "recent_posts",
      fields: RECENT_FIELDS,
      filters: {
        id: recent.id,
      },
    }).config({ name: "refetch-recent" });

    deleteRecentStep({ id: recent.id });

    return new WorkflowResponse({
      id: recent.id,
      recent: recents[0],
    });
  },
);
