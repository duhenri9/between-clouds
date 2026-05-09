# ADR 0002 — WhatsApp-first; web is not a chat surface

- **Status:** Accepted
- **Date:** 2026-05-09

## Context

The product is conversational. We must choose where the conversation
lives. Options:

1. **Native mobile apps (iOS/Android).** Highest control, highest cost,
   slowest distribution, app-store friction.
2. **Web chat UI.** Cheap, but adds a surface that can host content,
   tempting deviation from ephemerality. Also weakens "ambient" framing.
3. **WhatsApp-first.** ← chosen.

## Decision

- WhatsApp is the conversational surface. Conversations exist there.
- The web exists for entry, consent, billing, account, and editorial
  content. The web does not host a chat UI.
- The Edge Gateway integrates with Meta WhatsApp Business Cloud API
  (primary) with Twilio and 360Dialog as fallbacks behind an adapter.

## Consequences

Positive:

- Distribution: users do not install anything.
- Ambient feel: the product appears in the user's everyday messaging
  surface.
- Reduced platform risk on mobile app stores.
- A single conversational surface keeps the privacy contract narrow.

Negative / costs:

- Vendor risk: WhatsApp policy changes can affect us.
- Voice/media support is bounded by WhatsApp's capabilities.
- The 24-hour WA messaging window adds operational constraints (we accept
  these because we explicitly do not want re-engagement nudges).

Reversal would require a clear product reason for adding a chat UI, and a
new privacy-impact analysis for the new surface.
