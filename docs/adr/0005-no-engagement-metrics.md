# ADR 0005 — No engagement metrics

- **Status:** Accepted
- **Date:** 2026-05-09

## Context

Most AI/consumer products optimize for retention, DAU/MAU, session
length, and streaks. These metrics are tightly coupled to design patterns
that conflict with Between Clouds' core promise (calm, ephemeral,
non-engagement).

If we measure these metrics, organizational gravity will eventually push
the product to optimize for them — even with the best intentions.

## Decision

- The analytics catalogue is a **closed list** (see `11-observability.md §2`).
- DAU, MAU, retention curves, streaks, session-length leaderboards, and
  emotional-state profiling for marketing or growth are **forbidden**.
- The forbidden list is enforced by:
  - schema-level rejection of disallowed analytics fields,
  - code review,
  - explicit ADR requirement for any metric not on the allowed list.
- Safety-critical experimentation may NOT vary safety guardrails between
  treatment groups.

## Consequences

Positive:

- The product's promise is structurally protected, not merely declared.
- Cultural defense against creep.

Negative / costs:

- Some growth conversations become harder to settle with data.
- Investors or partners accustomed to standard SaaS dashboards may push
  back. The architecture document is the answer.

Reversal requires a successor ADR with explicit reasoning.
