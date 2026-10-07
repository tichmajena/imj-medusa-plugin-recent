import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { RECENT_MODULE } from "../../modules/recent";
import RecentModuleService from "../../modules/recent/service";

type CreateRecentItemInput = {
  recent_id: string;
  title: string;
  item_id: string;
  item_type: string;
};

export const createRecentItemStep = createStep(
  "create-recent-item-step",
  async (input: CreateRecentItemInput, { container }) => {
    const recentModuleService: RecentModuleService =
      container.resolve(RECENT_MODULE);
    const item = await recentModuleService.createRecentItems(input);

    return new StepResponse(item, item.id);
  },
  async (id, { container }) => {
    if (!id) {
      return;
    }

    const recentModuleService: RecentModuleService =
      container.resolve(RECENT_MODULE);
    await recentModuleService.deleteRecentItems(id);
  },
);
