import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import {
  listRecentsQueryConfig,
  retrieveRecentQueryConfig,
} from "./query-config";
import {
  GetStoreRecentsParams,
  PostStoreCreateRecent,
  PostStoreCreateRecentItem,
} from "./validators";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/customers/me/recents",
      method: "POST",
      middlewares: [validateAndTransformBody(PostStoreCreateRecent)],
    },
    {
      matcher: "/store/customers/me/recents",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          GetStoreRecentsParams,
          listRecentsQueryConfig,
        ),
      ],
    },
    {
      matcher: "/store/customers/me/recents/:id",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          createFindParams(),
          retrieveRecentQueryConfig,
        ),
      ],
    },
    {
      matcher: "/store/customers/me/recents/:id/items",
      method: "POST",
      middlewares: [validateAndTransformBody(PostStoreCreateRecentItem)],
    },
  ],
});
