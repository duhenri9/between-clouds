# ADR 0001 — Ephemeral by default

- **Status:** Accepted
- **Date:** 2026-05-09

## Context

Between Clouds is positioned as Ephemeral Emotional Computing. The product
promise is that conversations disappear after each session. The rest of
the architecture is downstream of this choice.

Alternatives considered:

1. **Always-on transcript with optional purge** (mainstream chat-app default).
2. **Server-side summary + raw transcript retained for X days.**
3. **Truly ephemeral by default, opt-in persistence.** ← chosen.

## Decision

- Cloud Session mode is the default. No conversation content is persisted
  outside Redis with bounded TTL and explicit DEL on session end.
- Memory Mode exists only as an explicit, reversible Pro opt-in storing
  abstracted summaries — never raw transcripts.
- This invariant is enforced by schema, redaction at source, and CI checks.

## Consequences

Positive:

- Differentiation in a category dominated by retention-optimizing products.
- Lower data-breach blast radius.
- Simpler GDPR/LGPD posture for the default mode.

Negative / costs:

- We cannot rely on long-context personalization.
- Debugging production issues is harder — we see no content.
- Some user requests ("can you remember what I told you yesterday?") must
  be answered honestly with "I don't, and that's the point."

This ADR is binding. Reversal requires a successor ADR with explicit
reasoning, plus product leadership approval.
