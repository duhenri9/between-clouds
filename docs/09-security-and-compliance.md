# 09 — Security & compliance

## 1. Threat model (high level)

| Asset                    | Threat                                       | Primary control                              |
| ------------------------ | -------------------------------------------- | -------------------------------------------- |
| Conversation content     | Persistence beyond session                   | Schema constraints, redaction at source      |
| Phone numbers            | Re-identification across logs                | HMAC at ingress, plaintext never stored      |
| BYO API keys             | Exfiltration                                 | Envelope encryption, access scoped to AI Provider Layer |
| Auth sessions            | Hijack via XSS / fixation                    | HttpOnly Secure cookies, short TTL, rotation |
| Stripe webhooks          | Forgery                                      | Signature verification, replay window        |
| WhatsApp webhooks        | Forgery                                      | `X-Hub-Signature-256` verification           |
| AI providers             | Prompt-injection escalation, data exfil      | Layer-1 reinforcement, no tool use in v1     |
| Operators                | Insider access to user content               | Engineering policy: no content surfaces; reviewed access |
| Crisis events            | Mishandling causing real-world harm          | `12-crisis-protocol.md`                      |

## 2. Encryption

### 2.1 In transit

- TLS 1.2 minimum, TLS 1.3 preferred for all external endpoints.
- HSTS on the web with preload.
- mTLS or signed JWT for service-to-service inside the cluster.
- AI provider calls go to vendor TLS endpoints; no proxying through
  insecure internal hops.

### 2.2 At rest

- Postgres: disk encryption (managed provider). Sensitive columns use
  envelope encryption with a KMS-managed key:
  - `users.byo_api_key_encrypted`
  - `optional_memory_profiles.summary`
- Redis: managed provider with at-rest encryption; we still treat Redis
  as memory and do not back it up.
- Audit log sink: at-rest encryption + WORM (write-once-read-many) where
  available.

### 2.3 Hashing

- Phone WA ids: HMAC-SHA256 with a service key, key-rotatable. Rotation
  procedure documented; old hashes are NOT migrated (we don't have the
  plaintext).

## 3. Secrets management

- A single managed secret store. Examples: AWS Secrets Manager,
  GCP Secret Manager, Doppler. Final choice in roadmap.
- No secrets in `.env` committed files; `.env.example` only.
- Local dev uses a developer-scoped store.
- All secret reads go through `shared/config`; no ad hoc `process.env` in
  domain code.
- Secret rotation runbooks for: WhatsApp app secret, Stripe webhook secret,
  HMAC keys, JWT signing keys, AI provider keys.

## 4. Logging policy (binding)

Allowed in logs:

- request id, route, status, latency
- user id (uuid), `wa_id_hmac`
- event kinds (`session.opened`, etc.)
- safety verdict severities and categories — **no content**

Forbidden in logs:

- message body (inbound or outbound)
- prompt text
- model output
- email, IP plaintext, raw `wa_id`
- BYO API keys

Enforcement:

- `shared/redaction` middleware.
- A unit test asserts known forbidden field names cannot pass through the
  logger.
- A periodic log-sample audit is part of the on-call rotation.

## 5. Access control

- Operator console (admin tool) shows: account metadata, billing status,
  consent log, audit events. **It does not show content. It does not
  allow content read paths. There are no content read paths.**
- All admin actions are themselves audit-logged.
- Production data access is gated by SSO + hardware key.

## 6. GDPR & LGPD

### 6.1 Lawful basis

- Cloud Session: consent at onboarding for processing during the session;
  legitimate interest for billing/security metadata.
- Memory Mode: explicit, separate consent.

### 6.2 Data subject rights

| Right                    | Mechanism                                         |
| ------------------------ | ------------------------------------------------- |
| Access                   | `GET /api/account/me` returns account metadata; "no transcripts to provide" is a true and documented response. |
| Rectification            | Account screens; `/api/account/locale`, etc.      |
| Erasure                  | `POST /api/account/erase`. SLA 30 days, target 24 h. |
| Portability              | JSON export of metadata + (if Memory Mode) summaries. |
| Objection                | Memory Mode opt-out is one click. Cloud Session inherently respects it. |
| Withdraw consent         | Same as erasure.                                  |

### 6.3 DPA & subprocessors

- Maintain a public list of subprocessors: WhatsApp/Meta, AI provider,
  Stripe, hosting provider, observability sink.
- Update notifications follow the policy required by GDPR/LGPD.

### 6.4 Cross-border transfers

- EU users routed to EU-resident infrastructure where feasible.
- AI provider transfers governed by the provider's standard contractual
  clauses.

## 7. Disclaimers (binding copy in every locale)

- **Not therapy.**
- **Not medical advice.**
- **Not emergency support.**

These appear:

- on the landing page,
- on the onboarding consent screen,
- in the WhatsApp first-session greeting (compactly),
- in the legal/disclaimers route.

Locale parity (EN/PT-BR minimum) required at merge.

## 8. Incident response

- On-call rotation with paging.
- Severity levels: SEV-1 (privacy breach or content leak), SEV-2 (auth or
  billing breach), SEV-3 (degraded availability), SEV-4 (cosmetic).
- SEV-1 triggers: regulator notification within statutory window, user
  notification within 72 h where required, post-mortem within 5 business
  days. Post-mortems are blameless and shared internally.
- Tabletop exercises: quarterly.

## 9. Vulnerability management

- SCA in CI (npm audit / OSV scanner).
- SAST for the backend.
- Dependency updates on a weekly cadence.
- Annual penetration test by an external firm, scope including the
  ephemerality and crisis paths.

## 10. Operational red lines

These are non-negotiable. Crossing them is a release blocker:

1. No content in logs.
2. No content in Postgres.
3. No content in backups.
4. No telemetry that profiles emotional state for marketing.
5. No "we miss you" outbound messages.
6. No A/B test that varies safety guardrails by treatment group.
