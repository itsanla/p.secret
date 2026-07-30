import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { updateCredential, deleteCredential } from "@/lib/credentials";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    if (!body.name || !body.value || !body.service || !body.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    updateCredential(id, {
      name: body.name,
      value: body.value,
      service: body.service,
      type: body.type,
      tags: body.tags || [],
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update credential:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    deleteCredential(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete credential:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
