import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createRecentWorkflow } from "../../../../../workflows/create-recent";
import { getSalesChannelId } from "../../../../utils/sales-channel";
import type {
  GetStoreRecentsParamsType,
  PostStoreCreateRecentType,
} from "../../../../validators";

export async function POST(
  req: AuthenticatedMedusaRequest<PostStoreCreateRecentType>,
  res: MedusaResponse,
) {
  const { result } = await createRecentWorkflow(req.scope).run({
    input: {
      customer_id: req.auth_context.actor_id,
      sales_channel_id: getSalesChannelId(req),
      post_type: req.validatedBody.post_type,
    },
  });

  res.status(201).json({ recent: result.recent });
}

export async function GET(
  req: AuthenticatedMedusaRequest<GetStoreRecentsParamsType>,
  res: MedusaResponse,
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data, metadata } = await query.graph({
    entity: "recent_posts",
    fields: req.queryConfig.fields,
    filters: {
      customer_id: req.auth_context.actor_id,
      ...req.filterableFields,
    },
    pagination: req.queryConfig.pagination,
  });

  res.json({
    recents: data,
    count: metadata?.count ?? data.length,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? data.length,
  });
}
