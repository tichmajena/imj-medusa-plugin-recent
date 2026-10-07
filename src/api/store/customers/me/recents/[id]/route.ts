import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { deleteRecentWorkflow } from "../../../../../../workflows/delete-recent";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data } = await query.graph({
    entity: "recent_posts",
    fields: req.queryConfig.fields,
    filters: {
      id: req.params.id,
      customer_id: req.auth_context.actor_id,
    },
  });

  if (!data.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Recent with id: ${req.params.id} was not found`,
    );
  }

  res.json({ recent: data[0] });
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const { result } = await deleteRecentWorkflow(req.scope).run({
    input: {
      recent_id: req.params.id,
      customer_id: req.auth_context.actor_id,
    },
  });

  res.json({ id: result.id, object: "recent", deleted: true });
}
