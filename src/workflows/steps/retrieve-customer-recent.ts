import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";

export type CustomerRecent = {
  id: string;
  customer_id: string;
  sales_channel_id: string;
  post_type: string;
  items: { id: string; item_id: string; item_type: string }[];
};

type RetrieveCustomerRecentStepInput = {
  recent_id: string;
  customer_id: string;
};

export const retrieveCustomerRecentStep = createStep(
  "retrieve-customer-recent-step",
  async (input: RetrieveCustomerRecentStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data } = await query.graph({
      entity: "recent_posts",
      fields: [
        "id",
        "customer_id",
        "sales_channel_id",
        "post_type",
        "items.id",
        "items.item_id",
        "items.item_type",
      ],
      filters: {
        id: input.recent_id,
        customer_id: input.customer_id,
      },
    });

    const recent = data[0] as CustomerRecent | undefined;

    if (!recent) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Recent with id: ${input.recent_id} was not found`,
      );
    }

    return new StepResponse(recent);
  },
);
