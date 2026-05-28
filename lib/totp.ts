import type { TOTPAccount, ServiceType } from "@/types";

export function parseTOTPAccounts(): TOTPAccount[] {
  const env = process.env;
  const accounts: TOTPAccount[] = [];

  Object.keys(env).forEach((key) => {
    const match = key.match(/^TOTP_(\d+)_SECRET$/);
    if (!match) return;
    const n = match[1];
    const secret = env[`TOTP_${n}_SECRET`] || "";
    const name = env[`TOTP_${n}_NAME`] || "";
    const issuer = env[`TOTP_${n}_ISSUER`] || name;
    const service = (env[`TOTP_${n}_SERVICE`] || "other") as ServiceType;
    if (secret && name) {
      accounts.push({ name, secret, issuer, service, backupCodes: [] });
    }
  });

  return accounts;
}
