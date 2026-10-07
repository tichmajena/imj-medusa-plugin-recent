import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { RECENT_MODULE } from "../../modules/recent";
import RecentModuleService from "../../modules/recent/service";

type DeleteRecentItemInput = {
  recent_item_id: string;
};

export const deleteRecentItemStep = createStep(
  "delete-recent-item-step",
  async ({ recent_item_id }: DeleteRecentItemInput, { container }) => {
    const recentModuleService: RecentModuleService =
      container.resolve(RECENT_MODULE);
    await recentModuleService.softDeleteRecentItems(recent_item_id);

    return new StepResponse(void 0, recent_item_id);
  },
  async (recentItemId, { container }) => {
    const recentModuleService: RecentModuleService =
      container.resolve(RECENT_MODULE);
    await recentModuleService.restoreRecentItems([recentItemId]);
  },
);
