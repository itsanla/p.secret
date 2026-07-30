import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { Credential, CredentialType, ServiceType } from "@/types";

const dbPath = process.env.SQLITE_DB_PATH || path.join(process.cwd(), "data", "psecret.sqlite");

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS credentials (
    id TEXT PRIMARY KEY,
    service TEXT NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL,
    tags TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  )
`);

// Seeding function from .env files to migrate existing configurations
function seedFromEnv() {
  const countRow = db.prepare("SELECT COUNT(*) as count FROM credentials").get() as { count: number };
  if (countRow.count > 0) return;

  const env = process.env;
  const credentialsToInsert: Omit<Credential, "id" | "createdAt" | "updatedAt">[] = [];

  Object.keys(env).forEach((key) => {
    const match = key.match(/^CRED_(\d+)_SERVICE$/);
    if (!match) return;
    const n = match[1];
    const service = (env[`CRED_${n}_SERVICE`] || "other") as ServiceType;
    const name = env[`CRED_${n}_NAME`] || "";
    const type = (env[`CRED_${n}_TYPE`] || "other") as CredentialType;
    const tags = (env[`CRED_${n}_TAGS`] || "").split(",").map((t) => t.trim()).filter(Boolean);

    const rawValue = env[`CRED_${n}_VALUE`] || "";
    const b64Value = env[`CRED_${n}_VALUE_B64`] || "";
    let value = rawValue;
    if (b64Value) {
      value = Buffer.from(b64Value, "base64").toString("utf-8");
    }

    if (name && value) {
      credentialsToInsert.push({
        service,
        name,
        value,
        type,
        tags,
      });
    }
  });

  if (credentialsToInsert.length > 0) {
    const insertStmt = db.prepare(`
      INSERT INTO credentials (id, service, name, value, type, tags, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((creds) => {
      creds.forEach((c: any, index: number) => {
        const id = `env-${index}-${Date.now()}`;
        const now = Date.now();
        insertStmt.run(id, c.service, c.name, c.value, c.type, JSON.stringify(c.tags), now, now);
      });
    });

    transaction(credentialsToInsert);
    console.log(`[Database] Seeded ${credentialsToInsert.length} credentials from environment variables.`);
  }
}

// Execute seeding
try {
  seedFromEnv();
} catch (err) {
  console.error("Failed to seed database from env:", err);
}
