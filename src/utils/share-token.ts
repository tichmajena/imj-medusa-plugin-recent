import { createHmac, randomUUID } from "crypto";
import type { MedusaContainer } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { sign, verify, type JwtPayload } from "jsonwebtoken";

const ALGORITHM = "HS256";
const ISSUER = "medusa-plugin-recent";
const AUDIENCE = "recent:share";

export const SHARE_TOKEN_EXPIRES_IN = "7d";

function getSigningKey(container: MedusaContainer): Buffer {
  const { http } = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE,
  ).projectConfig;

  if (typeof http.jwtSecret !== "string" || !http.jwtSecret) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "A JWT secret must be configured to share recents.",
    );
  }

  return createHmac("sha256", http.jwtSecret).update(AUDIENCE).digest();
}

export function signRecentShareToken(
  container: MedusaContainer,
  recentId: string,
): string {
  return sign({ recent_id: recentId }, getSigningKey(container), {
    algorithm: ALGORITHM,
    issuer: ISSUER,
    audience: AUDIENCE,
    subject: recentId,
    jwtid: randomUUID(),
    expiresIn: SHARE_TOKEN_EXPIRES_IN,
  });
}

export function verifyRecentShareToken(
  container: MedusaContainer,
  token: string,
): string {
  let payload: JwtPayload;

  try {
    payload = verify(token, getSigningKey(container), {
      algorithms: [ALGORITHM],
      issuer: ISSUER,
      audience: AUDIENCE,
    }) as JwtPayload;
  } catch {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid or expired share token",
    );
  }

  if (typeof payload.recent_id !== "string" || !payload.recent_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid or expired share token",
    );
  }

  return payload.recent_id;
}
