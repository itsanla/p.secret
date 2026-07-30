import { NextResponse } from "next/server";

export async function GET() {
  const issuer = process.env.KEYCLOAK_ISSUER || "https://sso.anla.my.id/realms/master";
  const clientId = process.env.KEYCLOAK_CLIENT_ID || "p.secret";
  const redirectUri = `${process.env.NEXTAUTH_URL || "https://secret.anla.my.id"}/api/auth/callback/keycloak`;
  
  const authUrl = `${issuer}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid+profile+email`;
  
  return NextResponse.redirect(authUrl);
}
