import RecentModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const RECENT_MODULE = "recent";

export default Module(RECENT_MODULE, {
  service: RecentModuleService,
});
