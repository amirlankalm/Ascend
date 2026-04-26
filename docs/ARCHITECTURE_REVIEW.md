# Ascend Architecture Review

This document explains the architecture decisions behind the MVP in a concise review format.

## System Boundary

Ascend has five major layers:

```text
UI layer
Application/API layer
AI orchestration layer
Persistence layer
Deployment/operations layer
```

## UI Layer

Framework:

- Next.js App Router
- React 19
- TypeScript
- TailwindCSS v4

Interactive surfaces:

- graph canvas: React Flow
- page transitions/loading: Framer Motion
- custom design primitives: local components under `src/components/design`

Important UI modules:

- `AppShell` provides the career OS frame.
- `Glyph` provides custom pixel icons.
- `EngineStrip` provides repeated telemetry patterns.
- `PathGraph` renders graph state.
- `ProofWorkbench` manages validation flow.
- `OpportunityRadar` manages opportunity matching/filtering.

## Application/API Layer

Next.js route handlers provide the application backend:

```text
POST /api/graph
GET  /api/state
POST /api/proof/submit
POST /api/opportunities/match
POST /api/quests/today
GET  /api/cron/daily
GET  /api/health
```

The API layer is responsible for:

- validating client input shape at the product level
- calling AI functions
- writing Supabase records when authenticated
- returning fallback-compatible state to the client

## AI Orchestration Layer

AI code lives in:

```text
src/lib/ai/
```

Design choices:

- keep prompts centralized
- use structured JSON outputs
- validate responses with Zod
- provide deterministic fallbacks
- avoid inline prompts in UI components

Why:

- UI stays maintainable
- demo remains stable without API keys
- structured outputs reduce parsing errors

## Persistence Layer

Persistence is implemented in:

```text
src/lib/supabase/
supabase/migrations/
supabase/seed/
```

Main design:

- Supabase Auth identifies users.
- Postgres stores graph, proof, portfolio, and match data.
- RLS protects private rows.
- public grants are readable by everyone.
- private proof files go in the `proofs` storage bucket.
- pgvector support is included for semantic grant matching.

Fallback:

- if Supabase is not configured or user is anonymous, client local storage keeps demo state.

This allows both a reliable hackathon demo and a production path.

## Graph Model

Graph nodes and edges represent the student's execution path.

Node examples:

- goal
- skill
- quest
- proof
- portfolio
- grant
- milestone

Edge examples:

- `unlocks`
- `proves`
- `requires`
- `funds`
- `improves`

Unlocking is handled in:

```text
src/lib/graph/unlock.ts
```

The rule is intentionally simple for MVP:

```text
complete a proof-producing quest -> unlock direct downstream nodes -> resolve dependency-complete nodes
```

## Security Model

Supabase RLS protects:

- profiles
- goals
- graph nodes
- graph edges
- quests
- proofs
- portfolio items
- grant matches
- embeddings
- activity logs

Policy pattern:

```sql
auth.uid() = user_id
```

Profiles use:

```sql
auth.uid() = id
```

Grants are public-read because the opportunity database is shared data.

## Deployment Model

Vercel hosts the Next.js app.

Vercel Cron is configured in:

```text
vercel.json
```

The cron endpoint is:

```text
/api/cron/daily
```

It is protected by `CRON_SECRET` when configured.

## Quality Gates

Before pushing:

```bash
npm run lint
npm run build
```

Recommended CI:

```bash
npm ci
npm run lint
npm run build
```

## Main Tradeoffs

### Demo fallback vs production persistence

Fallback mode adds some complexity, but it prevents the product from failing during demos when credentials are missing.

### Custom pixel glyphs vs icon package

Custom glyphs take more code, but they make the app visually distinct and avoid generic icon-library aesthetics.

### Simple unlock rules vs full graph solver

The MVP uses a simple deterministic unlock rule. This is enough for demo clarity and can evolve into a richer dependency engine later.

### Seeded opportunities vs live opportunity scraper

Seeded data is stable and judge-friendly. Live scraping/search can be added later, but it would add reliability risk during the MVP stage.

## Next Architecture Improvements

- Add real file upload flow for proof attachments.
- Add embedding generation job for grants and user proof artifacts.
- Add Supabase Edge Function or server job for daily quest refresh.
- Add Playwright smoke tests for the full demo loop.
- Add role-specific goal templates beyond AI founder.
- Add audit trail UI from `activity_log`.

