import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { MedusaError } from "@medusajs/framework/utils";
import { RECENT_MODULE } from "../../modules/recent";
import RecentModuleService from "../../modules/recent/service";

type CreateRecentStepInput = {
  customer_id: string;
  sales_channel_id: string;
  post_type: string;
};

export const createRecentStep = createStep(
  "create-recent-step",
  async (input: CreateRecentStepInput, { container }) => {
    const recentModuleService: RecentModuleService =
      container.resolve(RECENT_MODULE);

    try {
      const recent = await recentModuleService.createRecentPosts(input);

      return new StepResponse(recent, recent.id);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("IDX_recent_posts_customer_id_post_type_unique")
      ) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          `Customer already has a recent with post_type: ${input.post_type}`,
        );
      }

      throw error;
    }
  },
  async (id, { container }) => {
    if (!id) {
      return;
    }

    const recentModuleService: RecentModuleService =
      container.resolve(RECENT_MODULE);

    await recentModuleService.deleteRecentPosts(id);
  },
);
