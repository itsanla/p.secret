import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "@/types";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret");
const EXPIRY = 100 * 365 * 24 * 60 * 60;

export async function signToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY}s`)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = "auth-token";
