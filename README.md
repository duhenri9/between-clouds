# Between Clouds

> Speak freely. Leave lightly.

**Between Clouds** is a WhatsApp-first ambient conversational platform that
offers temporary, encrypted, emotionally intelligent AI conversations designed
to disappear after each session.

It defines a new product category — **Ephemeral Emotional Computing** — and is
explicitly *not* a therapy app, productivity tool, journaling app, social
network, or general-purpose AI assistant.

---

## Core principles

| Principle             | What it means in engineering terms                                |
| --------------------- | ----------------------------------------------------------------- |
| Ephemeral by default  | No conversational state survives a session, unless user opts in.  |
| Privacy as posture    | Encryption in transit and at rest; minimum data retention.        |
| Calm interaction      | UX latency, motion, and copy optimized for decompression.         |
| Non-engagement        | Product never optimizes for retention, streaks, or addiction.     |
| Human-in-the-loop     | Crisis signals trigger de-escalation + handoff to human resources.|
| WhatsApp-first        | Primary surface is WhatsApp; the web is an entry point, not a UI. |

## Repository map

```
README.md                  ← you are here
ARCHITECTURE.md            ← master engineering blueprint
docs/
  01-product-philosophy.md
  02-system-architecture.md
  03-frontend.md
  04-backend.md
  05-whatsapp-integration.md
  06-ai-orchestration.md
  07-data-model.md
  08-ephemerality.md
  09-security-and-compliance.md
  10-i18n-and-payments.md
  11-observability.md
  12-crisis-protocol.md
  13-roadmap.md
  adr/
    0001-ephemeral-by-default.md
    0002-whatsapp-first.md
    0003-nestjs-postgres-redis.md
    0004-byo-openai-keys.md
    0005-no-engagement-metrics.md
```

## Status

Foundational architecture phase. No code yet — this repository currently holds
the canonical engineering specification that all subsequent implementation
must comply with.

## License & legal positioning

Between Clouds is **not therapy, not medical advice, not emergency support**.
All user-facing surfaces, onboarding, and AI prompts must communicate this
clearly. See `docs/09-security-and-compliance.md` and `docs/12-crisis-protocol.md`.
