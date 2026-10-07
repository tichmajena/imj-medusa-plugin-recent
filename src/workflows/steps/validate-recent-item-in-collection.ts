import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { MedusaError } from "@medusajs/framework/utils";
import type { CustomerRecent } from "./retrieve-customer-recent";

type ValidateRecentItemInCollectionInput = {
  recent: CustomerRecent;
  item_id: string;
};

export const validateRecentItemInCollectionStep = createStep(
  "validate-recent-item-in-collection-step",
  async ({ recent, item_id }: ValidateRecentItemInCollectionInput) => {
    const matches =
      recent.items?.filter((item) => item.item_id === item_id) ?? [];

    if (!matches.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Item does not exist in the recent collection",
      );
    }

    if (matches.length > 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Multiple recent items were found for item_id: ${item_id}`,
      );
    }

    return new StepResponse(matches[0]);
  },
);
