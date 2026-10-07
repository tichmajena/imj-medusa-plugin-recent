import { createStep } from "@medusajs/framework/workflows-sdk";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";

type ValidateCustomerCreateRecentStepInput = {
  customer_id: string;
  post_type: string;
};

export const validateCustomerCreateRecentStep = createStep(
  "validate-customer-create-recent-step",
  async (
    { customer_id, post_type }: ValidateCustomerCreateRecentStepInput,
    { container },
  ) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data: recents } = await query.graph({
      entity: "recent_posts",
      fields: ["id"],
      filters: {
        customer_id,
        post_type,
      },
    });

    if (recents.length) {
      throw new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `Customer already has a recent with post_type: ${post_type}`,
      );
    }

    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id"],
      filters: {
        id: customer_id,
      },
    });

    if (!customers.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Specified customer was not found",
      );
    }
  },
);
