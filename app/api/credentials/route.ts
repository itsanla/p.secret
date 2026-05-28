import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { getAllCredentials, createCredential } from "@/lib/credentials";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const credentials = await getAllCredentials();
  return NextResponse.json(credentials);
}

export async function POST(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { service, name, value, type, tags } = body;
    if (!service || !name || !value || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const credential = await createCredential({
      service,
      name,
      value,
      type,
      tags: Array.isArray(tags) ? tags : [],
    });
    return NextResponse.json(credential, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
