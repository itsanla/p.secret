export interface JWTPayload {
  username: string;
  iat: number;
  exp: number;
}

export interface TOTPAccount {
  email: string;
  secret: string;
  backupCodes: string[];
}

export type CredentialType = "api_key" | "password" | "token" | "pem" | "json" | "other";

export type ServiceType =
  | "aws"
  | "google"
  | "azure"
  | "github"
  | "facebook"
  | "docker"
  | "groq"
  | "gmail"
  | "dns"
  | "payment"
  | "brave"
  | "other";

export interface Credential {
  id: string;
  service: ServiceType;
  name: string;
  value: string;
  type: CredentialType;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}
