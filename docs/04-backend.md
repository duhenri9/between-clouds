# 04 — Backend (NestJS)

## 1. Stack

| Layer                | Choice                          |
| -------------------- | ------------------------------- |
| Runtime              | Node.js 20 LTS                  |
| Framework            | NestJS (modular monolith v1)    |
| Language             | TypeScript (strict)             |
| HTTP                 | Fastify adapter                 |
| ORM                  | Prisma (preferred) or Drizzle   |
| Queue                | BullMQ on Redis                 |
| Cache / ephemeral    | Redis 7+                        |
| Realtime             | Native WS gateway (NestJS)      |
| Validation           | Zod (over class-validator) for shared schemas with frontend |
| Tests                | Vitest + Supertest + Pact (contract) |
| OpenAPI              | Auto-generated from controllers |

A modular monolith is intentional for v1. Bounded contexts are designed so
each can be extracted to a service later without API change.

## 2. Module layout

```
src/
  main.ts
  app.module.ts
  modules/
    gateway/                  # webhook ingress, signature verification
    onboarding/               # consent, deeplink token issuance
    sessions/                 # ephemeral session lifecycle
    orchestrator/             # prompt assembly, AI routing
    safety/                   # crisis detection, output policing
    ai-providers/             # adapter implementations
    billing/                  # stripe + entitlements
    account/                  # user profile, memory-mode, erasure
    localization/             # locale + currency resolution
    observability/            # tracing, metrics, audit logs
    queue/                    # BullMQ queues + workers
  shared/
    crypto/                   # HMAC, envelope encryption helpers
    prompts/                  # prompt templates per locale
    redaction/                # PII scrub utilities
    errors/                   # typed application errors
    config/                   # zod-validated env config
```

## 3. Public HTTP surface

### 3.1 Web-facing API (auth required for account)

```
POST /api/onboarding/consent
POST /api/onboarding/presence
POST /api/billing/checkout
POST /api/billing/portal
POST /api/account/memory-mode
POST /api/account/locale
POST /api/account/erase
GET  /api/account/me
```

### 3.2 External webhooks

```
POST /webhooks/whatsapp        # Meta Cloud API
POST /webhooks/stripe          # Stripe events
POST /webhooks/whatsapp/twilio # Fallback provider
```

Webhook handlers are thin: verify, dedupe, enqueue, return 200. All
business logic runs in workers.

### 3.3 Internal RPC

For the realtime gateway, internal RPC over WS or a private REST surface.
Auth via short-lived service JWT.

## 4. Cross-cutting middleware order

```
1. Request id assignment
2. Structured logging context
3. Body capture for signature verification (raw body)
4. Provider signature verification (where applicable)
5. Idempotency check (Redis)
6. Rate limit (token bucket)
7. CSRF (browser routes only)
8. Auth (account routes only)
9. Locale resolution
10. Controller
```

## 5. Idempotency

Two scopes:

- **Provider events:** keyed on `wamid` (WhatsApp), `event.id` (Stripe).
  Stored in Redis for 24 h. On hit, return a synthetic 200 and skip work.
- **Web mutations:** `Idempotency-Key` header from the client. Stored 24 h
  with the response payload for replay.

## 6. Rate limiting

| Surface                 | Limit (default)              | Burst        |
| ----------------------- | ---------------------------- | ------------ |
| WhatsApp inbound (per phone) | 20 msg / minute         | 5 / 5 sec    |
| Web mutations (per IP)  | 60 / minute                  | 10 / 5 sec   |
| Stripe webhook          | trusted, but capped at 200/s overall | -    |

Limits are tuned by observability, not by retention goals. Under abuse, the
gateway returns a calm message — never an error stack.

## 7. Error model

A single `AppError` taxonomy:

```ts
type AppError =
  | { kind: 'validation';    issues: ZodIssue[] }
  | { kind: 'unauthorized' }
  | { kind: 'forbidden' }
  | { kind: 'not_found' }
  | { kind: 'conflict';      reason: string }
  | { kind: 'rate_limited';  retryAfterSec: number }
  | { kind: 'safety_blocked';category: SafetyCategory }
  | { kind: 'provider_unavailable'; providerId: string }
  | { kind: 'internal' };
```

External responses never expose stack traces or model errors. The
user-facing message is locale-aware and calm.

## 8. Configuration & secrets

- All env vars are parsed through a Zod schema in `shared/config`. Boot
  fails fast if any required var is missing or malformed.
- Secrets live in the platform's managed secret store. `.env` files are for
  local dev only and never committed.
- Per-environment config files are committed; per-environment **secrets**
  are not.

## 9. Logging & redaction

- Structured JSON logs.
- A redaction middleware strips known PII fields (`phone`, `wa_id`,
  `message_text`, prompt text, model output text) **before** the log is
  emitted — not at the log shipper.
- Log levels: `fatal`, `error`, `warn`, `info`, `debug`. `info` is the
  production default. `debug` never enabled in prod.
- Audit logs (consent changes, memory-mode toggles, erasures) go to a
  separate, immutable sink.

## 10. Background jobs (BullMQ)

| Queue                  | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `wa.inbound`           | Process inbound WhatsApp message                 |
| `wa.outbound`          | Send outbound WhatsApp message (with retry)      |
| `session.gc`           | Sweep expired sessions, ensure Redis DEL parity  |
| `billing.reconcile`    | Stripe → Postgres reconciliation                 |
| `account.erase`        | GDPR/LGPD erasure execution                      |
| `safety.shadow-eval`   | Run new Safety rule sets in shadow before promotion |

Retry policy: exponential backoff, max 5 attempts, dead-letter queue with
alerting. `wa.outbound` includes a "calm fallback" path on terminal failure.

## 11. Testing strategy

- **Unit:** pure modules (prompt assembly, redaction, crypto).
- **Module:** NestJS test modules with in-memory Postgres (pg-mem) and
  Redis (ioredis-mock).
- **Contract:** Pact tests for the WhatsApp + Stripe webhook handlers
  against fixtures captured from the providers.
- **Safety regression:** a curated suite of crisis prompts, jailbreak
  prompts, and possessive-drift prompts. Must all pass before deploy.
- **End-to-end:** minimal — onboarding → first message → first response →
  session end → Redis empty.

CI gating: lint, typecheck, unit, module, contract, safety regression. E2E
on staging post-merge.
