import { getAllCredentials } from "@/lib/credentials";
import { parseTOTPAccounts } from "@/lib/totp";
import DashboardClient from "./components/dashboard-client";

export default async function DashboardPage() {
  const [credentials, totpAccounts] = await Promise.all([
    getAllCredentials(),
    Promise.resolve(parseTOTPAccounts()),
  ]);

  return <DashboardClient initialCredentials={credentials} totpAccounts={totpAccounts} />;
}
