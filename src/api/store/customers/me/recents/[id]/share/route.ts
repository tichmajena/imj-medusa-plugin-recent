import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import {
  SHARE_TOKEN_EXPIRES_IN,
  signRecentShareToken,
} from "../../../../../../../utils/share-token";

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data } = await query.graph({
    entity: "recent_posts",
    fields: ["id"],
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

  res.json({
    token: signRecentShareToken(req.scope, data[0].id),
    expires_in: SHARE_TOKEN_EXPIRES_IN,
  });
}
