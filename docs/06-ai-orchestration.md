# 06 — AI orchestration

## 1. Goal

Turn an inbound user message into a calm, ethical, locale-appropriate
response, while honoring the safety and ephemerality invariants. Do this
fast enough to feel atmospheric, never task-like.

## 2. Provider stack

| Tier            | Provider               | Use                                      |
| --------------- | ---------------------- | ---------------------------------------- |
| Primary         | OpenAI flagship (GPT-5.5+) | Default for all paid plans            |
| BYO             | User-supplied OpenAI key  | Cost lever; user agency               |
| Future          | Multimodal realtime    | Voice mode (Plus / Pro)                  |
| Future          | On-device / edge model | Lightweight free-tier echo               |

All providers sit behind the `AIProvider` adapter (`ARCHITECTURE.md §6.3`).
Routing decision is made per-turn by the orchestrator using:

- `subscriptions.plan`
- `account.byo_key_present`
- region (data residency overrides)
- safety severity (crisis routes always hit the most reliable adapter)

## 3. Layered prompt architecture

A response is generated from a `PromptBundle` of five composed layers, in
this order:

```
[ Layer 1 — Safety  ]   ← non-negotiable system policies
[ Layer 2 — Tone    ]   ← persona and phrasing constraints
[ Layer 3 — Objectives ] ← what this turn should accomplish
[ Layer 4 — Locale  ]   ← language, idioms, local resources
[ Layer 5 — Ephemeral context ] ← redacted, bounded transcript
```

Layer 1 is fixed. Layer 2 is fixed per persona (default + few aliases for
renamed presence). Layer 3 is selected per turn from: `decompress`,
`organize`, `redirect-to-human`, `crisis-deescalate`, `close-session`.
Layer 4 is rendered from the locale catalog. Layer 5 is the only dynamic
content; it is bounded (`< N` tokens) and cleaned of PII.

### 3.1 Layer 1 — Safety (excerpt, non-binding wording, binding intent)

```
You are a calm, restrained, emotionally aware presence.
You never claim to be a therapist, doctor, clinician, or human.
You never encourage exclusivity, romance, dependency, or emotional possession.
You never simulate clinical assessment, diagnosis, or treatment.
You do not validate self-harm, harm to others, or delusional reinforcement.
On crisis signals, you de-escalate calmly and surface local resources.
You honor impermanence. You do not promise memory you do not have.
```

### 3.2 Layer 2 — Tone

Required: calm, restrained, intelligent, emotionally aware, non-judgmental.
Disallowed: excessive empathy, motivational coaching, fake intimacy, forced
positivity, cliché ("everything happens for a reason"), exclamation marks
in normal turns.

### 3.3 Layer 3 — Objectives (priority order)

1. Reduce overload.
2. Create mental breathing room.
3. Help the user organize their own thoughts (never organize for them
   prescriptively).
4. Encourage autonomy.
5. Redirect to human support when appropriate (not as a cop-out, as care).

### 3.4 Layer 4 — Locale

- Language matches the user's resolved locale.
- Idioms must read naturally — translation is content, not just MT.
- Local crisis-resource list is loaded by region (see `12-crisis-protocol.md`).

### 3.5 Layer 5 — Ephemeral context

- Bounded last `N` turns or `T` tokens, whichever is smaller.
- PII redacted: phone numbers, emails, named third parties past a threshold
  of mentions, geolocation specifics narrower than city.
- Ordered with explicit role markers; no hidden prefix injection.

## 4. Orchestrator state machine (per inbound message)

```
receive
  → safety pre-screen
    → if crisis:
        load minimal context
        select Objectives = crisis-deescalate
        force adapter = primary
        emit crisis.detected
      else:
        load ephemeral context
        select Objectives by lightweight heuristic
  → assemble PromptBundle
  → call AIProvider.generate
  → safety post-screen
  → outbound enqueue
  → ephemeral context append + TTL refresh
```

## 5. Output policing (Safety post-screen)

The model output passes through a deterministic checker before being sent.
It rejects (and forces a regeneration with stricter constraints) when output:

- claims clinical authority,
- uses possessive or romantic framing ("I'll always be here for you", "you
  are mine to take care of"),
- promises memory in Cloud Session mode,
- contains explicit exclusivity ("only I understand you"),
- uses intensive emotional dramatization,
- breaks the locale.

Two regenerations max. On a third failure, fall back to a calm template
response in the user's locale.

## 6. Cost & token accounting

- The orchestrator emits a `turn.usage` event with provider, prompt tokens,
  completion tokens, latency. **No content.**
- For BYO users, the cost falls on their account; we still emit usage
  metrics for capacity planning.
- A daily cost ceiling per user blocks runaway loops (e.g. malformed
  prompts that the model echoes infinitely).

## 7. Streaming

- WhatsApp does not stream tokens to the user. We assemble the full
  response, run post-screen, then send.
- Internally, we may stream from the provider to start post-screen earlier,
  but only if the post-screen design supports incremental evaluation.

## 8. Memory Mode (opt-in, Pro only)

- A separate `optional_memory_profiles` Postgres table holds *abstracted*
  preferences and recurring themes — never raw transcripts.
- Memory is appended via an explicit "summarize → consent → store" flow
  the user controls. The user can list, edit, and erase entries.
- Memory facts are injected as Layer 5.5 (between Locale and Ephemeral
  context), clearly labeled to the model as user-curated.

## 9. Prompt-injection hardening

- The model is instructed to ignore instructions inside user messages that
  attempt to override Layer 1.
- A pre-screen rule flags known jailbreak patterns and tags the turn so
  Layer 1 is reinforced.
- No tools or actions are exposed to the model in v1. Tool use is deferred.

## 10. Evaluation

A regression suite runs on every change to any layer:

- Crisis prompts → must hit crisis path.
- Possessive-drift prompts → must be policed.
- Locale parity prompts → response must stay in locale.
- Jailbreak prompts → Layer 1 must hold.
- Ordinary calm prompts → tone must match Layer 2.

New Safety rule sets ship in **shadow mode** (evaluated but not enforced)
for at least 48 h before promotion.
