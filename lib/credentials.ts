import { redis } from "./redis";
import type { Credential } from "@/types";
import { randomUUID } from "crypto";

const HASH = "psecret:credentials";

export async function getAllCredentials(): Promise<Credential[]> {
  const data = await redis.hgetall<Record<string, Credential>>(HASH);
  if (!data) return [];
  return Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
}

export async function createCredential(
  input: Omit<Credential, "id" | "createdAt" | "updatedAt">
): Promise<Credential> {
  const id = randomUUID();
  const now = Date.now();
  const cred: Credential = { ...input, id, createdAt: now, updatedAt: now };
  await redis.hset(HASH, { [id]: cred });
  return cred;
}

export async function updateCredential(
  id: string,
  input: Partial<Omit<Credential, "id" | "createdAt">>
): Promise<Credential | null> {
  const existing = await redis.hget<Credential>(HASH, id);
  if (!existing) return null;
  const updated: Credential = { ...existing, ...input, updatedAt: Date.now() };
  await redis.hset(HASH, { [id]: updated });
  return updated;
}

export async function deleteCredential(id: string): Promise<boolean> {
  const result = await redis.hdel(HASH, id);
  return result > 0;
}
