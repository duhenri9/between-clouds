# 01 — Product philosophy

This document encodes the philosophy that engineering decisions must defer to.
When a tradeoff is unclear, this document wins.

## 1. Category

**Ephemeral Emotional Computing.** Digital systems designed to provide
emotionally intelligent, temporary, non-permanent conversational experiences
focused on psychological decompression, privacy, and calm interaction.

Subcategory: **Ambient Emotional Interface Systems** — calm AI environments
that feel atmospheric and minimally intrusive.

## 2. The user we are designing for

| The user should feel        | The user must NEVER feel       |
| --------------------------- | ------------------------------ |
| Emotionally lighter         | Trapped                        |
| Mentally quieter            | Profiled                       |
| Less overloaded             | Analyzed                       |
| Safe expressing thoughts    | Emotionally manipulated        |
| Free of storage anxiety     | Observed by algorithms         |

Engineering corollary: any code, copy, animation, or notification that pulls
the user toward the right column is a defect, regardless of whether it ships
or improves a metric.

## 3. What Between Clouds is not

Between Clouds **does not** compete with: therapy apps, productivity software,
journaling apps, social media, AI assistants. It must not borrow their
patterns:

- no streaks, badges, levels, or progress UI
- no "your weekly summary"
- no "people are using Between Clouds right now"
- no companion / character / romantic framing
- no push-back-into-product nudges

## 4. What we optimize for (and what we refuse to)

| Optimize                  | Refuse                          |
| ------------------------- | ------------------------------- |
| Release                   | Retention                       |
| Emotional breathing room  | Engagement loops                |
| Impermanence              | Behavioral permanence           |
| Privacy                   | Profiling                       |
| Calm interaction          | Dopamine spikes                 |

## 5. Tone & language guardrails (binding for prompt + UI)

Required qualities of the AI persona:

- calm, restrained, intelligent, emotionally aware, non-judgmental.

Disallowed:

- excessive empathy, motivational coaching, fake intimacy, forced positivity,
  romantic or possessive framing, dependency-encouraging language,
  therapist-simulation, clinical claims, dramatization.

First-response examples (correct):

- "You don't need to organize everything before you begin."
- "You can speak at your own pace."

First-response examples (wrong):

- "How can I help you today?"
- "I'm here for you 💙"
- "Tell me everything."

## 6. Cloud Presence System

The AI surface identity. Default presence is the official Between Clouds
atmospheric sphere — semi-translucent, fog-like, soft luminous blue, organic
movement, no geometric perfection.

Users may:

- keep the official presence (default),
- upload a custom avatar,
- use minimal initials,
- rename the presence ("Cloud", "Blue", "Nova"…) within anti-abuse filters.

Restrictions enforced by the rename pipeline:

- block manipulative names (impersonation of real people, brands),
- block romantic/possessive framing,
- block clinical-authority impersonation ("Dr. ___", "Therapist ___").

## 7. Modes

- **Cloud Session (default).** Encrypted, ephemeral, no permanent memory.
- **Memory Mode (Pro, opt-in).** Long-term continuity. Never default. Always
  reversible. Each enable/disable is a logged consent event.

## 8. Engineering implications cheat-sheet

| Principle              | Code-level enforcement                                    |
| ---------------------- | --------------------------------------------------------- |
| Ephemerality           | Redis-only conversational state, TTL + explicit DEL       |
| Calm                   | No notification tokens stored, no scheduled re-engagement |
| Non-engagement         | Analytics schema rejects DAU/streak/retention fields      |
| Anti-dependency        | Safety layer rewrites possessive/romantic LLM drift       |
| Non-clinical           | Crisis path hands off to local resources, never simulates |
| Locale parity          | Every user-visible string EN + PT-BR before merge         |
