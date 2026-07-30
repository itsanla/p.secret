import { randomUUID } from "crypto";
import { db } from "./db";
import type { Credential } from "@/types";

export function getAllCredentials(): Credential[] {
  try {
    const rows = db.prepare("SELECT * FROM credentials ORDER BY createdAt DESC").all() as any[];
    return rows.map((row) => ({
      id: row.id,
      service: row.service,
      name: row.name,
      value: row.value,
      type: row.type,
      tags: JSON.parse(row.tags),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  } catch (err) {
    console.error("Failed to query credentials:", err);
    return [];
  }
}

export function createCredential(data: Omit<Credential, "id" | "createdAt" | "updatedAt">): Credential {
  const id = randomUUID();
  const now = Date.now();
  
  db.prepare(`
    INSERT INTO credentials (id, service, name, value, type, tags, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.service, data.name, data.value, data.type, JSON.stringify(data.tags), now, now);

  return {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateCredential(id: string, data: Omit<Credential, "id" | "createdAt" | "updatedAt">): void {
  const now = Date.now();
  db.prepare(`
    UPDATE credentials
    SET service = ?, name = ?, value = ?, type = ?, tags = ?, updatedAt = ?
    WHERE id = ?
  `).run(data.service, data.name, data.value, data.type, JSON.stringify(data.tags), now, id);
}

export function deleteCredential(id: string): void {
  db.prepare("DELETE FROM credentials WHERE id = ?").run(id);
}
