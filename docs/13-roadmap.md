# 13 — Engineering roadmap

A phased plan that sequences work without committing to dates. Each phase
ends with a release-readiness gate.

## Phase 0 — Foundations (current)

- This documentation set merged.
- Repository scaffolding (Next.js app, NestJS app, shared packages).
- CI: lint, typecheck, format, dependency scan.
- Secret store chosen (target: managed cloud secret manager).
- Observability provider chosen (target: OpenTelemetry sink).

**Gate:** ARCHITECTURE.md and ADRs 0001–0005 reviewed and merged. Repo
scaffolds present, CI green on a no-op PR.

## Phase 1 — Core conversational loop

Goal: a real ephemeral session over WhatsApp, end-to-end, in EN and PT-BR.

- Edge Gateway with WhatsApp Cloud API webhook + signature verification.
- Idempotency, rate limiting.
- Postgres schema (users, consent, subscriptions stubs, audit log).
- Redis ephemeral session store.
- Conversation Orchestrator with layered prompt assembly.
- AI Provider Layer with OpenAI flagship adapter.
- Safety Engine v1 (lexicon + classifier scaffold + post-screen).
- Web onboarding (consent → presence → deeplink).
- Locale catalogs for EN and PT-BR.
- Logging + redaction + minimal dashboards.

**Gate:**

- Synthetic E2E session passes in EN and PT-BR.
- Safety regression suite green.
- Ephemerality probe green (no Redis residue post-close).
- Security review of webhook + secrets.

## Phase 2 — Billing & plans

- Stripe Customer / Subscription / Checkout, currency-aware.
- Plan → entitlement enforcement (session length, message caps).
- Web account zone (plan, language, erase request).
- Erasure pipeline with audit.

**Gate:** End-to-end purchase + cancel + reactivate in GBP, USD, EUR, BRL.
Erasure SLA verified on staging.

## Phase 3 — Memory Mode (opt-in)

- `optional_memory_profiles` table + service.
- Summarize → consent → store flow.
- Layer-5.5 injection in prompt assembly.
- Edit / list / erase UX in account zone.

**Gate:** Memory Mode opt-in/out cycles cleanly. Disabling deletes all
profiles. AI never claims memory in Cloud Session mode (regression test).

## Phase 4 — Voice (Plus & Pro)

- Multimodal/realtime model adoption behind a flag.
- WhatsApp voice handling (inbound transcription, outbound TTS) — note
  that this expands the privacy surface; review required before launch.
- Updated prompt layers for voice tone calibration.

**Gate:** Voice opt-in flow, latency under target, transcripts not
persisted, privacy review signed off.

## Phase 5 — BYO OpenAI

- Key upload + validation in account zone.
- Encrypted key storage (envelope).
- Adapter routing per user.
- Pricing rebalance.

**Gate:** BYO Pro subscriber's turns route through their key end-to-end;
key revocation purges within minutes.

## Phase 6 — Locale expansion

- ES, FR catalogs.
- Locale-specific crisis resources reviewed by SMEs.
- Bias audit on safety classifier per added locale.

**Gate:** Parity tests green; SME review signed off.

## Phase 7 — Hardening & scale

- Per-region WhatsApp numbers.
- Twilio / 360Dialog fallback wired.
- Multi-region deployment for EU residency.
- Annual external pen test executed.

**Gate:** Pen test findings remediated to acceptable risk; failover drill
passes.

## Cross-phase, always-on

- Quarterly Safety SME review.
- Quarterly privacy red-team.
- Weekly dependency updates.
- Continuous evaluation of crisis path metrics.

## Out of scope (v1, possibly ever)

- Public group conversations.
- Persistent transcript download.
- Therapy claims of any kind.
- Mood-tracking features that persist signals across sessions.
- Push-back-into-product nudges.

## Decision deferrals

These are deliberate; ADRs will be added when decided:

- Backend hosting target (Kubernetes vs Fly.io vs ECS).
- Observability sink concrete vendor.
- ORM final choice (Prisma vs Drizzle).
- CMS strategy for editorial content beyond MDX-in-repo.
