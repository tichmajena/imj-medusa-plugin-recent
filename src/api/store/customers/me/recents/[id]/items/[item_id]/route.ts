import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { deleteRecentItemWorkflow } from "../../../../../../../../workflows/delete-recent-item";

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const { result } = await deleteRecentItemWorkflow(req.scope).run({
    input: {
      recent_id: req.params.id,
      item_id: req.params.item_id,
      customer_id: req.auth_context.actor_id,
    },
  });

  res.json({ recent: result.recent });
}
