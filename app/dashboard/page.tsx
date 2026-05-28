import { parseEnvCredentials } from "@/lib/credentials";
import { parseTOTPAccounts } from "@/lib/totp";
import DashboardClient from "./components/dashboard-client";

export default function DashboardPage() {
  const credentials = parseEnvCredentials();
  const totpAccounts = parseTOTPAccounts();
  return <DashboardClient credentials={credentials} totpAccounts={totpAccounts} />;
}
