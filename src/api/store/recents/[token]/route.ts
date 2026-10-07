import type {
  MedusaResponse,
  MedusaStoreRequest,
} from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { verifyRecentShareToken } from "../../../../utils/share-token";

export async function GET(req: MedusaStoreRequest, res: MedusaResponse) {
  const salesChannelIds = req.publishable_key_context?.sales_channel_ids;

  if (!salesChannelIds?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "At least one sales channel ID is required to be associated with the publishable API key in the request header.",
    );
  }

  const recentId = verifyRecentShareToken(req.scope, req.params.token);
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data } = await query.graph({
    entity: "recent_posts",
    fields: [
      "id",
      "sales_channel_id",
      "post_type",
      "created_at",
      "updated_at",
      "items.*",
    ],
    filters: {
      id: recentId,
    },
  });

  if (!data.length) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No recent found");
  }

  if (!salesChannelIds.includes(data[0].sales_channel_id)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Recent does not belong to the request's sales channel",
    );
  }

  res.json({ recent: data[0] });
}
