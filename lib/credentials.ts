import type { Credential, CredentialType, ServiceType } from "@/types";

export function parseEnvCredentials(): Credential[] {
  const env = process.env;
  const credentials: Credential[] = [];

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
      credentials.push({
        id: `env-${n}`,
        service,
        name,
        value,
        type,
        tags,
        createdAt: parseInt(n),
        updatedAt: parseInt(n),
      });
    }
  });

  return credentials.sort((a, b) => a.createdAt - b.createdAt);
}

// Kept for future Redis-based additions
export { parseEnvCredentials as getAllCredentials };
