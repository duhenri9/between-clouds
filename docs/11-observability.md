# 11 — Observability

## 1. Posture

We observe the **system**, not the **user**. Specifically:

- We measure health (latency, error rate, availability).
- We measure capacity (queue depth, AI cost).
- We measure compliance signals (consent flow completion, erasure SLA).
- We **do not** measure engagement (DAU, MAU, retention curves, streak
  length, "time spent").
- We **do not** profile emotional state for analytics.

## 2. Allowed metrics catalogue

### 2.1 Health

- `http.request.duration` (p50, p95, p99) by route
- `http.request.errors` by route + status class
- `webhook.signature.failed` count
- `queue.depth` and `queue.lag` by queue
- `redis.ops`, `redis.errors`
- `postgres.query.duration`, slow query count

### 2.2 Conversation quality (no content)

- `session.opened`, `session.closed{reason}`, `session.expired`
- `turn.count` per session (distribution, not per-user time series)
- `turn.latency` end-to-end (the latency budget in `02-system-architecture.md §6`)
- `safety.verdict{severity, category}` counts
- `safety.post_screen.regenerated` count
- `ai.provider.error{provider, kind}` count

### 2.3 Capacity & cost

- `ai.tokens{provider, direction}`
- `ai.cost.usd{provider}` (estimated)
- BYO vs flagship split (counts only)

### 2.4 Compliance

- `consent.recorded{kind}` count
- `erasure.requested` count, `erasure.completed.duration` distribution
- `audit.events` count

## 3. Forbidden metrics

These must not exist. Their absence is a release-blocking invariant.

- DAU, MAU, WAU
- "stickiness" (DAU/MAU)
- streaks
- session length leaderboards
- per-user retention cohorts
- emotional-state classifiers used for marketing or product growth
- A/B tests that vary safety guardrails

## 4. Tracing

- OpenTelemetry SDK in NestJS.
- Spans named by domain (`orchestrator.assemblePrompt`,
  `safety.preScreen`, `ai.generate`).
- Attributes are scrubbed: no message body, no prompt text. Span
  attributes go through the same redaction layer as logs.

## 5. Logging

See `09-security-and-compliance.md §4`. Recap:

- Structured JSON.
- No content.
- Redaction at source.
- 30-day retention for ops logs; longer for audit.

## 6. Alerting

| Condition                                     | Severity | Action                              |
| --------------------------------------------- | -------- | ----------------------------------- |
| `webhook.signature.failed` rate > 1/min       | SEV-2    | Page on-call                        |
| `ai.provider.error` rate > 5% over 5 min      | SEV-3    | Auto-degrade to fallback message    |
| `safety.classifier.unavailable`               | SEV-1    | Fail closed, page on-call           |
| `redis.unavailable`                           | SEV-1    | Refuse new sessions, page on-call   |
| `erasure.completed.duration` p95 > 7 days     | SEV-2    | Compliance review                   |
| `queue.depth` > threshold for 10 min          | SEV-3    | Scale workers                       |

SLOs:

- Webhook ingress availability: 99.9% / month.
- End-to-end response latency p95: ≤ 6 s.
- Erasure SLA: ≤ 30 days (target 24 h).
- Crisis path classifier availability: 99.95%.

## 7. Dashboards

A small set, intentionally:

- "System health" — latencies, errors, queues.
- "Safety" — verdict severities, regenerations, classifier health.
- "Capacity & cost" — tokens, AI provider split.
- "Compliance" — consent, erasure, audit volumes.

There is **no** "engagement" dashboard. Requests for one require an ADR.

## 8. Privacy-first frontend analytics

- Server-side counted page views only (no fingerprinting).
- No third-party analytics scripts on the landing or account zone.
- Cookie banner only where strictly required; default is no analytics cookies.
