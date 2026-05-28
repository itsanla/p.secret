import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { parseEnvCredentials } from "@/lib/credentials";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(parseEnvCredentials());
}
