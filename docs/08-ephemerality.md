# 08 — Ephemerality

Ephemerality is not a feature; it is the spine of the product. This
document defines exactly what "disappears" means, where, when, and how it
is verified.

## 1. Definitions

- **Ephemeral content:** any conversation turn (inbound or outbound) and
  any model-internal scratch state derived from it.
- **Cloud Session:** the default mode. Ephemeral content lives only in
  Redis, only for the duration of the session, and is destroyed on session
  end.
- **Memory Mode (opt-in):** abstracted summaries persist; raw turns still
  do not. See `06-ai-orchestration.md §8`.

## 2. Lifetime guarantees

| State                          | Default lifetime                  |
| ------------------------------ | --------------------------------- |
| Active session context (Redis) | ≤ 30 min idle, ≤ 4 h hard cap     |
| Idempotency keys               | 24 h                              |
| Outbound delivery payloads     | until ack or terminal failure     |
| Logs (no content)              | 30 days                           |
| Audit logs (no content)        | per legal retention               |
| Conversation content elsewhere | **never persisted**               |

## 3. Where conversation content may exist

Allowed:

- In flight on TLS connections (WhatsApp, AI provider, internal RPC).
- In Redis under `session:{userIdHmac}` and `session:{userIdHmac}:turns`,
  TTL-bound.
- In the AI provider's own short-term context for the duration of the
  generate call.

Disallowed:

- Postgres (any table, any column).
- Logs, traces, error reports, alerting payloads.
- Analytics events.
- Backups (because Redis is excluded from backup).
- Any third-party processor outside the named AI provider.

## 4. End-of-session protocol

Trigger sources:

1. User-initiated (`/end`, locale equivalent, "thanks I'm done" detected
   intent).
2. Idle TTL elapsed.
3. Hard cap (4 h) reached.
4. Crisis handoff path completed.

Procedure on every trigger:

```
1. Orchestrator emits `session.closing` with reason.
2. Send a calm closing line in user's locale.
3. Explicit Redis DEL of:
     session:{userIdHmac}
     session:{userIdHmac}:turns
4. Emit `session.closed` event.
5. Cancel any pending generation (best effort) and ignore late completions.
```

We do not rely on TTL alone for session end. TTL is the lower bound of
safety; explicit DEL is the upper.

## 5. Crash and outage behavior

- If the orchestrator crashes mid-turn, the next inbound message starts a
  fresh session. The user sees "this space restarted" in their locale.
- If Redis loses data, the same applies.
- We do **not** reconstruct context from any other source — no Postgres
  shadow, no log reassembly. Reconstruction would defeat the contract.

## 6. Concurrency

- A single user has at most one active session. A second WhatsApp surface
  (e.g. the user messaging from a different device) joins the existing
  session, it does not branch.
- Memory Mode operations on summaries are serialized per-user via a Redis
  mutex.

## 7. Verification

The ephemerality contract is verified by:

### 7.1 Static checks (CI)

- A migration linter that fails if a new column resembles content storage
  (regex on column names + free-text type detection on tables outside the
  audit schema).
- A grep-based linter that fails if `console.log` / logger calls receive
  a variable named like a message body.

### 7.2 Runtime probes

- A scheduled job opens a synthetic session, exchanges turns, closes,
  and asserts `KEYS session:{probeId}*` returns empty within the TTL+ε.
- A nightly job samples random expired session ids and asserts absence.

### 7.3 Privacy red-team (manual, quarterly)

- Attempt to retrieve "what did user X say last Tuesday" from production
  using only operator tools. Must fail.
- Attempt to reconstruct a user's last turn from logs/traces. Must fail.

## 8. User-visible communication

The ephemerality contract is part of the product's emotional value, so it
must be communicated:

- On the landing page (calmly, not in marketing tone).
- On the onboarding consent screen (specific: what is stored, where, for
  how long).
- On WhatsApp at session start (one short line, optional after first time).
- On WhatsApp at session end (one short line).

Wording lives in the i18n catalog. EN/PT-BR parity required.

## 9. What "ephemeral" does not mean

- It does not mean unencrypted in transit. TLS is mandatory.
- It does not mean undocumented. We log non-content events for ops.
- It does not mean unbillable. Coarse counters in `session_usage` are
  permitted (see `07-data-model.md §2.4`).
- It does not mean unsafe. Crisis handoffs may produce a one-line audit
  record (no content) for ops.
