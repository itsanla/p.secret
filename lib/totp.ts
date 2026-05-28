import type { TOTPAccount } from "@/types";

export function parseTOTPAccounts(): TOTPAccount[] {
  const accounts: TOTPAccount[] = [];
  const env = process.env;

  Object.keys(env).forEach((key) => {
    const match = key.match(/^GMAIL(\d+)_USERNAME$/);
    if (!match) return;
    const n = match[1];
    const email = env[`GMAIL${n}_USERNAME`] || "";
    const secret = env[`GMAIL${n}_AUTHENTICATOR`] || "";
    const codes = env[`GMAIL${n}_BACKUP_CODES`] || "";
    if (email && secret) {
      accounts.push({
        email,
        secret,
        backupCodes: codes.split(",").map((c) => c.trim()).filter(Boolean),
      });
    }
  });

  return accounts.sort((a, b) => a.email.localeCompare(b.email));
}
