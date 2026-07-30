import { NextRequest, NextResponse } from "next/server";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  
  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }
  
  const issuer = process.env.KEYCLOAK_ISSUER || "https://sso.anla.my.id/realms/master";
  const clientId = process.env.KEYCLOAK_CLIENT_ID || "p.secret";
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || "";
  const redirectUri = `${process.env.NEXTAUTH_URL || "https://secret.anla.my.id"}/api/auth/callback/keycloak`;
  
  try {
    // Exchange code for token
    const tokenResponse = await fetch(`${issuer}/protocol/openid-connect/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Token exchange failed:", errText);
      return NextResponse.json({ error: "Token exchange failed" }, { status: 500 });
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user info
    const userInfoResponse = await fetch(`${issuer}/protocol/openid-connect/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    
    if (!userInfoResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch user info" }, { status: 500 });
    }
    
    const userInfo = await userInfoResponse.json();
    const username = userInfo.preferred_username || userInfo.email || "sso-user";
    
    // Sign our own auth token and log in
    const token = await signToken(username);
    
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 100 * 365 * 24 * 60 * 60,
      path: "/",
    });
    
    return response;
  } catch (err) {
    console.error("SSO Callback Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
