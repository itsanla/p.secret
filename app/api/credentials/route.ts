import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { getAllCredentials, createCredential } from "@/lib/credentials";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getAllCredentials());
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.value || !body.service || !body.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const created = createCredential({
      name: body.name,
      value: body.value,
      service: body.service,
      type: body.type,
      tags: body.tags || [],
    });
    return NextResponse.json(created);
  } catch (err) {
    console.error("Failed to create credential:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
