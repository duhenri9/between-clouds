# ADR 0004 — Bring-your-own OpenAI key as a cost lever

- **Status:** Accepted
- **Date:** 2026-05-09

## Context

LLM inference is the dominant variable cost. Two strategies:

1. **Charge a price that absorbs flagship inference at our cost.** Forces
   either high prices or thin margins.
2. **Offer a Pro tier where users can supply their own OpenAI API key**
   and pay us for orchestration, UX, and emotional architecture — not
   inference. ← chosen as an additional option.

This is **not** "the only path." Flagship-included plans remain available;
BYO is an alternative for users who already pay an AI provider and want a
better orchestration layer on top.

## Decision

- Pro plan optionally accepts a user-supplied OpenAI API key.
- Key stored encrypted (envelope) in Postgres; access scoped to the AI
  Provider Layer.
- The orchestrator routes that user's turns through their key.
- Pricing for BYO Pro is reduced versus flagship-included Pro.
- The user can revoke at any time; on revocation the key is deleted and
  the audit log records the event (no key material).

## Consequences

Positive:

- Better margins.
- User agency over their AI provider relationship.
- Clear positioning: we monetize orchestration and experience, not
  reselling tokens.

Negative / costs:

- Extra surface for credential handling and rotation.
- Variable per-user reliability (their keys may have rate limits).
- Customer support complexity (their key issues become user-facing).

Reversal: removing BYO is operationally trivial; we would simply migrate
those users to flagship-included pricing.
