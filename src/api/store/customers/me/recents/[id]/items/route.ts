import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { createRecentItemWorkflow } from "../../../../../../../workflows/create-recent-item";
import type { PostStoreCreateRecentItemType } from "../../../../../../validators";

export async function POST(
  req: AuthenticatedMedusaRequest<PostStoreCreateRecentItemType>,
  res: MedusaResponse,
) {
  const { result } = await createRecentItemWorkflow(req.scope).run({
    input: {
      recent_id: req.params.id,
      customer_id: req.auth_context.actor_id,
      title: req.validatedBody.title,
      item_id: req.validatedBody.item_id,
      item_type: req.validatedBody.item_type,
    },
  });

  res.status(201).json({ recent: result.recent });
}
