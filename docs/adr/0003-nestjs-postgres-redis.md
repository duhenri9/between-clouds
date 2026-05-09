# ADR 0003 — NestJS + PostgreSQL + Redis + BullMQ

- **Status:** Accepted
- **Date:** 2026-05-09

## Context

We need a backend stack that:

- has clean module boundaries (we will eventually split services),
- is mature in the TypeScript ecosystem,
- gives us solid primitives for queues, scheduled jobs, and websockets,
- has a strong typing story shared with the Next.js frontend.

Alternatives considered:

1. **Express + ad hoc structure.** Fast start, weak boundaries.
2. **Fastify + custom DI.** Performant but reinventing.
3. **NestJS.** ← chosen.
4. **Go services.** Considered for the Edge Gateway specifically; rejected
   for v1 to keep one language and one toolchain.

For data: PostgreSQL (durable, transactional, mature ecosystem) and Redis
(ephemeral state, queues, pub/sub) are an industry-standard pair.

## Decision

- Backend: **NestJS** (Fastify adapter), TypeScript strict, modular monolith.
- Durable store: **PostgreSQL**.
- Ephemeral / queue / cache: **Redis**.
- Jobs: **BullMQ** on Redis.
- Realtime: NestJS WebSocket Gateway (internal use; public surface is
  WhatsApp).

## Consequences

Positive:

- One language across web and backend; shared schemas (Zod).
- Module boundaries naturally encode the bounded contexts in
  `02-system-architecture.md`.
- Replaceable adapters for AI, WhatsApp, and Stripe slot in cleanly.

Negative / costs:

- NestJS has a learning curve and DI that some engineers find heavy.
- A modular monolith requires discipline to avoid back-channel coupling
  between modules.

We accept these. ADRs will document any future decomposition into
microservices.
