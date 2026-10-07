import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { RECENT_MODULE } from "../../modules/recent";
import RecentModuleService from "../../modules/recent/service";

type DeleteRecentStepInput = {
  id: string;
};

export const deleteRecentStep = createStep(
  "delete-recent-step",
  async ({ id }: DeleteRecentStepInput, { container }) => {
    const recentModuleService: RecentModuleService =
      container.resolve(RECENT_MODULE);

    await recentModuleService.softDeleteRecentPosts(id);

    return new StepResponse(void 0, id);
  },
  async (id, { container }) => {
    if (!id) {
      return;
    }

    const recentModuleService: RecentModuleService =
      container.resolve(RECENT_MODULE);

    await recentModuleService.restoreRecentPosts([id]);
  },
);
