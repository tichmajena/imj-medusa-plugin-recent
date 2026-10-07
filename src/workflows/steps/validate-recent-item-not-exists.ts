import { createStep } from "@medusajs/framework/workflows-sdk";
import { MedusaError } from "@medusajs/framework/utils";
import type { CustomerRecent } from "./retrieve-customer-recent";

type ValidateRecentItemNotExistsInput = {
  recent: CustomerRecent;
  item_id: string;
  item_type: string;
};

export const validateRecentItemNotExistsStep = createStep(
  "validate-recent-item-not-exists-step",
  async ({ recent, item_id, item_type }: ValidateRecentItemNotExistsInput) => {
    if (
      recent.items?.some(
        (item) => item.item_id === item_id && item.item_type === item_type,
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Item is already in the recent collection",
      );
    }
  },
);
