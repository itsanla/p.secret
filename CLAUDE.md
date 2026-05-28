# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server on http://localhost:3000
pnpm build      # build for production
pnpm start      # run production build
pnpm lint       # run ESLint
```

Use `pnpm` — this project has a `pnpm-lock.yaml` and the `node_modules` structure is pnpm-managed. Running `npm install` will fail.

## What this is

Personal unified dashboard combining a **Key Vault** (API keys, passwords, tokens, PEM files) and a **Google Authenticator clone** (TOTP codes with backup codes). Protected by a single username/password login that issues a ~permanent JWT session cookie.

## Auth flow

- `middleware.ts` guards all `/dashboard/*` routes — redirects to `/login` on missing/invalid JWT
- Login issues an HTTP-only cookie (`auth-token`) with a 100-year expiry (effectively permanent until explicit logout)
- Credentials from `.env`: `USERNAME`, `PASSWORD`, `JWT_SECRET`
- API routes re-verify the JWT on every request via `lib/auth.ts`

## Data storage

**Key Vault credentials** → Upstash Redis, stored as a single hash `psecret:credentials` with UUID field keys. Each value is a `Credential` object (see `types/index.ts`).

**TOTP accounts** → `.env` only, not in Redis. Pattern: `GMAIL{n}_USERNAME`, `GMAIL{n}_AUTHENTICATOR`, `GMAIL{n}_BACKUP_CODES` (comma-separated). The `lib/totp.ts` parser scans all env keys matching this pattern.

Redis client: `lib/redis.ts` using `@upstash/redis` — reads `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` from env.

## Architecture

```
app/
  page.tsx                  → redirects to /login
  login/page.tsx            → client-side login form
  dashboard/
    page.tsx                → server component: fetches credentials + parses TOTP, passes to client
    components/
      dashboard-client.tsx  → client wrapper: tab state (vault/auth), credential state management
      credential-grid.tsx   → search + service filter chips + card grid
      credential-card.tsx   → individual card: masked value, reveal, one-click copy, edit/delete
      credential-modal.tsx  → add/edit form (service, type, name, value, tags)
      otp-grid.tsx          → TOTP search + card grid
      otp-card.tsx          → live TOTP countdown + copy + backup codes modal
      logout-button.tsx
  api/
    auth/login/route.ts     → POST: validate creds, set cookie
    auth/logout/route.ts    → POST: clear cookie
    credentials/route.ts    → GET: list all, POST: create
    credentials/[id]/route.ts → PUT: update, DELETE: delete
lib/
  auth.ts         → signToken / verifyToken (jose, HS256), AUTH_COOKIE_NAME
  redis.ts        → Redis.fromEnv()
  credentials.ts  → getAllCredentials / createCredential / updateCredential / deleteCredential
  totp.ts         → parseTOTPAccounts() — reads GMAIL{n}_* env vars
types/index.ts    → Credential, TOTPAccount, ServiceType, CredentialType, JWTPayload
proxy.ts          → Edge-compatible JWT check for /dashboard routes (Next.js 16 renamed middleware → proxy)
```

## Credential data model

```typescript
interface Credential {
  id: string;            // UUID
  service: ServiceType;  // aws | google | azure | github | facebook | docker | groq | gmail | dns | payment | brave | other
  name: string;          // human label, e.g. "anlayx.01 groq key"
  value: string;         // the actual secret (any length, supports PEM/JSON)
  type: CredentialType;  // api_key | password | token | pem | json | other
  tags: string[];        // free-form lowercase tags
  createdAt: number;     // Unix ms
  updatedAt: number;
}
```

## Adding TOTP accounts

Add to `.env` following the numbered pattern (`.env` is gitignored):
```
GMAIL18_USERNAME="newaccount@gmail.com"
GMAIL18_AUTHENTICATOR="base32secrethere"
GMAIL18_BACKUP_CODES="code1,code2,code3"
```

The parser in `lib/totp.ts` will pick them up automatically on the next server start.

## Key implementation notes

- `next.config.ts` has no `output: "export"` — API routes require server rendering
- The Redis hash key `psecret:credentials` is namespaced to avoid collision with the sibling `auth` project (both share the same Upstash instance)
- Credential values are never included in search indexing — search only covers `name`, `service`, and `tags`
- The delete confirm UX is inline (no global modal) — the card uses `position: relative` for the overlay
