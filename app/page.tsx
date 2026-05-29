import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      redirect("/dashboard");
    }
  }

  redirect("/login");
}
