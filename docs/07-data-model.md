# 07 — Data model

The schema below is canonical for v1. Field types are abstract; the Prisma
or Drizzle declarations are derived from this.

## 1. Storage split

| Concern                           | Store              | Lifetime              |
| --------------------------------- | ------------------ | --------------------- |
| Identity, billing, consent        | PostgreSQL         | Durable (minimized)   |
| Memory Mode profiles (opt-in)     | PostgreSQL         | Durable, user-controlled |
| Audit logs (consent, erasure)     | PostgreSQL (separate schema, append-only) | Durable, immutable |
| Active session state              | Redis              | TTL (≤ 30 min idle, ≤ 4 h hard) |
| Idempotency keys                  | Redis              | 24 h                  |
| Rate-limit counters               | Redis              | seconds–minutes       |
| Queues / jobs                     | Redis (BullMQ)     | until completion      |

PostgreSQL **never** stores conversation turns. This is enforced by:

- absence of any column for message content,
- a CI test asserting no migration introduces such a column,
- code review.

## 2. PostgreSQL schema (logical)

### 2.1 `users`

| Column            | Type        | Notes                                     |
| ----------------- | ----------- | ----------------------------------------- |
| `id`              | uuid (pk)   |                                           |
| `wa_id_hmac`      | bytea       | HMAC-SHA256 of plaintext WA id with rotated key |
| `country_iso2`    | char(2)     | Resolved at consent; user-editable        |
| `locale`          | text        | BCP-47, e.g. `en`, `pt-BR`                |
| `currency`        | char(3)     | ISO-4217; nullable until first checkout   |
| `created_at`      | timestamptz |                                           |
| `last_active_at`  | timestamptz | Updated on session start; not per-message |
| `byo_key_present` | boolean     | True if user uploaded an OpenAI key       |
| `presence_kind`   | text        | `official` \| `upload` \| `initials`      |
| `presence_name`   | text        | Optional, anti-abuse filtered             |
| `status`          | text        | `active` \| `paused` \| `erased`          |

Indexes: unique on `wa_id_hmac`. No index on plaintext anything.

PII handling:

- `wa_id_hmac` is the only join key. Plaintext WA id never persisted.
- `presence_name` passes through the rename filter at write time.
- BYO key stored encrypted (envelope) with KMS-managed DEK; never logged.

### 2.2 `subscriptions`

| Column                | Type        | Notes                              |
| --------------------- | ----------- | ---------------------------------- |
| `id`                  | uuid (pk)   |                                    |
| `user_id`             | uuid (fk)   |                                    |
| `stripe_customer_id`  | text        |                                    |
| `stripe_subscription_id` | text     |                                    |
| `plan`                | text        | `free` \| `plus` \| `pro`          |
| `status`              | text        | Stripe-aligned                     |
| `currency`            | char(3)     |                                    |
| `current_period_end`  | timestamptz |                                    |
| `memory_mode_eligible`| boolean     | derived from plan, materialized    |
| `created_at`          | timestamptz |                                    |
| `updated_at`          | timestamptz |                                    |

### 2.3 `consent_logs` (append-only)

| Column          | Type        | Notes                              |
| --------------- | ----------- | ---------------------------------- |
| `id`            | uuid (pk)   |                                    |
| `user_id`       | uuid (fk)   |                                    |
| `kind`          | text        | `onboarding` \| `memory_mode_on` \| `memory_mode_off` \| `erasure_request` \| `terms_v_<n>` |
| `locale`        | text        | locale at time of consent          |
| `ip_hash`       | bytea       | HMAC of IP, not raw                |
| `user_agent`    | text        | Trimmed                            |
| `policy_version`| text        |                                    |
| `created_at`    | timestamptz |                                    |

Append-only enforced at the application layer (no UPDATE/DELETE statements
in code) and at the database layer (revoked privileges on the role).

### 2.4 `session_usage`

Tracks coarse usage counters for billing/entitlement enforcement only.
**No conversation content. No per-message records.**

| Column            | Type        | Notes                                |
| ----------------- | ----------- | ------------------------------------ |
| `id`              | uuid (pk)   |                                      |
| `user_id`         | uuid (fk)   |                                      |
| `day`             | date        | Day in user's locale tz              |
| `messages_count`  | int         | inbound + outbound                   |
| `seconds_active`  | int         | rounded                              |
| `plan_at_day`     | text        | snapshot                             |

Unique on (`user_id`, `day`). Counters are incremented from queue events,
never from message content.

### 2.5 `localization_settings`

| Column        | Type     | Notes                  |
| ------------- | -------- | ---------------------- |
| `user_id`     | uuid (pk, fk) |                   |
| `locale`      | text     | overrides auto-detect  |
| `currency`    | char(3)  | overrides auto-detect  |
| `timezone`    | text     | IANA                   |

### 2.6 `optional_memory_profiles`

Premium-only, opt-in. Stores **abstractions**, not transcripts.

| Column         | Type        | Notes                              |
| -------------- | ----------- | ---------------------------------- |
| `id`           | uuid (pk)   |                                    |
| `user_id`      | uuid (fk)   |                                    |
| `kind`         | text        | `theme` \| `preference` \| `boundary` |
| `summary`      | text        | model-generated, user-confirmed    |
| `created_at`   | timestamptz |                                    |
| `last_used_at` | timestamptz | for rotation/cleanup               |

Constraints: encrypted-at-rest column for `summary`; user-owned;
listable, editable, deletable through `/api/account/memory`.

### 2.7 `audit_log` (separate schema, immutable)

Service-level events. No PII beyond `user_id` and `kind`.

```
audit_log(id, user_id, actor, kind, payload_json, created_at)
```

`payload_json` is structurally constrained — see `09-security-and-compliance.md §4`.

## 3. Redis keyspace

```
session:{userIdHmac}                  HSET    fields: id, opened_at, last_turn_at, locale, plan, presenceName  TTL 30m sliding
session:{userIdHmac}:turns            LIST    redacted role-tagged turns (capped at N)                          TTL aligned
idem:{provider}:{event_id}            STRING  '1'                                                              TTL 24h
ratelimit:{scope}:{key}               STRING  token-bucket counter                                             short TTL
queue:wa.inbound, queue:wa.outbound, queue:session.gc, ...     BullMQ                                          per-job
pubsub:events                          channel internal events                                                  -
```

Rules:

- The orchestrator is the only writer to `session:*` and `session:*:turns`.
- The Edge Gateway is the only writer to `idem:*` and `ratelimit:*`.
- Workers consume queues and pubsub.

## 4. Erasure semantics

A GDPR/LGPD erasure (`/api/account/erase`):

1. Insert a `consent_logs` row of kind `erasure_request`.
2. Mark `users.status = 'erased'`, blank optional fields.
3. Cancel Stripe subscription via API; keep `stripe_customer_id` if legally
   required (tax records), otherwise null it.
4. Delete all `optional_memory_profiles` rows for that user.
5. Delete all Redis keys for that user (best-effort scan + DEL).
6. Append-only `audit_log` row records the erasure (no content).
7. Confirm via WhatsApp template + email if available.

SLA: 30 days max; target 24 h.

## 5. Backup posture

- Postgres: encrypted automated backups, retained 7 days, locked to region.
- Redis: no backups in the conventional sense — ephemerality is the design.
  We accept loss of in-flight sessions on a Redis incident; users will
  see a calm "this space restarted" message.
- Audit log: replicated to a separate immutable store with longer
  retention required by compliance (see `09-security-and-compliance.md`).
