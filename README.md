# Ascend

Ascend is an AI-native **Digital Social Elevator** for ambitious high school students.

It is not a static roadmap generator, a chatbot wrapper, or a grant directory. Ascend is a product loop that turns a student’s ambition into a living execution system:

```text
Goal -> AI Progress Graph -> Quest -> Proof -> Validation -> Portfolio -> Unlocks -> Opportunities
```

The current MVP is built as a futuristic career operating system with a pixel-frontier visual language, graph-based progress, proof validation, generated portfolio artifacts, and opportunity matching.

Live deployment:

[https://ascend-virid.vercel.app](https://ascend-virid.vercel.app)

## Product Idea

Most students know what they want in a vague way:

```text
I want to become an AI founder.
I want a scholarship.
I want to do research.
I want to build something impressive.
```

The problem is that they usually do not know what to do today, what proof matters, or how to turn small work into credible opportunity signal.

Ascend solves that by creating a **Path Engine**:

```text
Career Goal
-> Skills
-> Daily Quests
-> Proof
-> Portfolio Items
-> Grants / Scholarships / Competitions
-> Next Unlocks
```

The important product idea is that Ascend does not only give advice. It asks the student to produce proof, validates the proof, packages it into portfolio material, and updates the student’s graph.

## Core Demo Loop

The intended demo path is:

1. Student enters a goal and profile.
2. AI creates a personalized graph.
3. The graph renders as an interactive skill tree.
4. Student opens an available quest.
5. Student submits proof.
6. AI validates the proof.
7. Ascend generates a portfolio artifact.
8. New graph nodes unlock.
9. Opportunities are matched against the student’s proof and graph.

Default demo profile:

```text
Goal: I want to become an AI founder.
Age: 15
Country: Kazakhstan
Interests: startups, AI, research
Daily time: 30 minutes
Experience: olympiad/project experience
```

Example first quest:

```text
Analyze 3 AI startups.

For each startup, write:
- problem
- target user
- why AI matters
- one feature you would improve

Submit a 250-350 word analysis with one local founder insight.
```

## Stack

Frontend:

- Next.js App Router
- React 19
- TypeScript
- TailwindCSS v4
- React Flow via `@xyflow/react`
- Framer Motion
- shadcn-style local UI composition
- Custom pixel glyph system

Backend:

- Next.js Route Handlers
- Node.js runtime
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Supabase Row Level Security
- pgvector-ready schema
- Vercel Cron

AI:

- OpenAI API
- Structured JSON outputs
- Zod schemas
- Fallback deterministic generation when `OPENAI_API_KEY` is missing

Deployment:

- Vercel
- `vercel.json` cron configuration

Package manager:

- npm

## High-Level Architecture

```text
Browser
  |
  | Next.js pages and client components
  v
App Router UI
  |
  | fetch()
  v
Next.js API Routes
  |
  | AI calls
  v
OpenAI structured outputs
  |
  | persistence
  v
Supabase Auth + Postgres + Storage + pgvector
```

The app is designed to run in two modes:

1. **Secure Supabase mode**
   - User is authenticated.
   - Profile, goals, graph, quests, proofs, portfolio items, matches, and activity logs are stored in Supabase.
   - RLS ensures users can only read/write their own private data.

2. **Demo fallback mode**
   - Supabase env vars or auth are missing.
   - The app still works using deterministic demo data and browser local storage.
   - This keeps hackathon demos reliable even without backend credentials.

## Folder Structure

```text
src/
  app/
    page.tsx                         Landing page
    auth/                            Login/create account screen
    onboarding/                      Multi-step onboarding
    dashboard/
      graph/                         Main React Flow graph screen
      quest/[id]/                    Quest detail screen
      proof/[questId]/               Proof submission and validation screen
      portfolio/                     Generated portfolio artifacts
      opportunities/                 Opportunity radar
    api/
      graph/                         Generate and persist graph
      proof/submit/                  Validate proof and create portfolio item
      opportunities/match/           Match opportunities and persist matches
      quests/today/                  Return best current quest
      state/                         Load persisted Supabase state
      cron/daily/                    Vercel Cron endpoint

  components/
    auth/                            Auth UI
    design/                          App shell, pixel glyphs, design primitives
    graph/                           React Flow graph and nodes
    opportunities/                   Opportunity radar
    portfolio/                       Portfolio cards/grid
    proof/                           Proof workbench
    quest/                           Quest mission UI
    ui/                              Local shadcn-style primitives

  lib/
    ai/                              OpenAI client, structured AI pipelines, fallbacks
    demo/                            Demo graph, opportunities, local storage fallback
    graph/                           Unlock rules
    supabase/                        Browser/server clients and persistence functions
    utils.ts                         Shared helpers

  types/
    pathfinder.ts                    Core product types

supabase/
  migrations/                        Production database schema
  seed/                              Opportunity seed data

DESIGN.md                            Visual system and product design rules
vercel.json                          Cron configuration
```

## Product Engines

### 1. Path Engine

Path Engine turns user goals into graph nodes and edges.

Node types:

- `goal`
- `career`
- `skill`
- `quest`
- `proof`
- `grant`
- `portfolio`
- `milestone`
- `competition`

Node statuses:

- `locked`
- `available`
- `in_progress`
- `completed`

Edge relations:

- `requires`
- `unlocks`
- `proves`
- `improves`
- `funds`
- `depends_on`

Unlock rule:

```text
A locked node becomes available when its required upstream dependencies are completed.
```

Implementation:

- Demo graph: `src/lib/demo/graph.ts`
- Unlock logic: `src/lib/graph/unlock.ts`
- Graph UI: `src/components/graph/PathGraph.tsx`
- Node UI: `src/components/graph/CustomGraphNode.tsx`

### 2. Quest Engine

Quest Engine gives the student one concrete action they can do today.

Each quest includes:

- title
- why it matters
- instructions
- expected output
- time estimate
- XP reward
- related skills
- evaluation rubric

The quest page also shows:

- mission telemetry
- unlock logic
- proof blocks
- pass criteria
- proof template

Implementation:

- UI: `src/components/quest/QuestMission.tsx`
- API: `src/app/api/quests/today/route.ts`

### 3. Proof Engine

Proof Engine validates submitted work.

Proof types supported by the model:

- text proof
- optional external URL
- future Supabase Storage file path

The proof page includes:

- text proof input
- optional URL input
- preflight readiness checks
- readiness meter
- validation loading stages
- score cards
- feedback
- generated portfolio item preview

Validation output:

- validation score
- authenticity score
- effort score
- skill score
- pass/fail
- extracted skills
- feedback
- unlock recommendation

Implementation:

- UI: `src/components/proof/ProofWorkbench.tsx`
- API: `src/app/api/proof/submit/route.ts`
- AI validation: `src/lib/ai/path-engine.ts`
- fallback validation: `src/lib/ai/fallbacks.ts`

### 4. Portfolio Engine

Portfolio Engine converts validated proof into useful student signal.

Generated portfolio items include:

- title
- summary
- CV bullet
- long description
- skills
- tags
- polish score
- impact score

The portfolio page shows:

- generated artifacts
- copyable CV bullets
- accumulated skills
- export context
- artifact metrics

Implementation:

- UI: `src/components/portfolio/PortfolioGrid.tsx`
- AI generation: `src/lib/ai/path-engine.ts`

### 5. Opportunity Engine

Opportunity Engine matches the student’s graph and proof to opportunities.

Seeded opportunities include:

- STEM olympiad
- youth founder microgrant
- AI hackathon
- local innovation competition
- scholarship preparation program
- science fair
- volunteering leadership program
- international student exchange

The radar page includes:

- semantic match cards
- match score
- provider
- country/region
- deadline
- amount
- reason
- missing proof
- next action
- filters for all/ready/urgent opportunities

Implementation:

- UI: `src/components/opportunities/OpportunityRadar.tsx`
- seed data: `src/lib/demo/opportunities.ts`
- API: `src/app/api/opportunities/match/route.ts`
- Supabase seed: `supabase/seed/001_grants.sql`

## AI Architecture

AI code is centralized under:

```text
src/lib/ai/
```

Main functions:

```ts
generateProgressGraph(profile, goal)
generateQuest(userState, graphContext)
validateProof(quest, proof, graphContext)
generatePortfolioItem(proof, quest, profile, validation)
matchOpportunityReason(userState)
```

The implementation uses:

- OpenAI Responses API
- structured JSON schema outputs
- Zod validation
- error handling
- deterministic fallback data

Why fallbacks matter:

- The product remains demoable without an OpenAI key.
- Build and preview environments do not crash when env vars are missing.
- Judges can still see the full product loop.

## Supabase Database

The production schema is in:

```text
supabase/migrations/202604260001_pathfinder_schema.sql
```

It creates:

- `profiles`
- `goals`
- `graph_nodes`
- `graph_edges`
- `quests`
- `proofs`
- `portfolio_items`
- `grants`
- `grant_matches`
- `embeddings`
- `activity_log`

It also configures:

- `vector` extension
- `pgcrypto`
- RLS policies
- indexes
- updated-at triggers
- private `proofs` storage bucket
- owner-only storage policies
- `match_grants(...)` similarity search function

### Data Ownership

Private user data is protected by RLS.

Most private tables use:

```sql
auth.uid() = user_id
```

Profiles use:

```sql
auth.uid() = id
```

Grants are public-readable because opportunity data is not private.

### Storage

Proof files are intended to live in the private Supabase bucket:

```text
proofs
```

Storage policy:

```text
users can upload/read files only under their own user-id folder
```

Example future path:

```text
proofs/{user_id}/{quest_id}/{filename}
```

## Runtime API Routes

### `POST /api/graph`

Generates a graph from onboarding input.

When authenticated:

- upserts profile
- inserts goal
- inserts graph nodes
- inserts graph edges
- inserts quests
- logs activity

When unauthenticated:

- returns generated state to the browser
- browser stores demo state locally

### `GET /api/state`

Loads the authenticated user’s latest persisted state from Supabase.

Fallback:

- returns `null` when unauthenticated or Supabase is not configured
- client falls back to local demo state

### `POST /api/proof/submit`

Validates proof and creates portfolio material.

When authenticated:

- inserts proof
- stores validation scores
- updates quest status
- creates portfolio item
- updates graph unlock statuses
- logs activity

### `POST /api/opportunities/match`

Refreshes opportunity matches.

When authenticated:

- persists grant matches if matching grants exist in Supabase

### `GET /api/cron/daily`

Vercel Cron endpoint.

Currently returns the intended daily job plan:

- refresh today’s quests
- check upcoming deadlines
- create activity events
- mark urgent opportunities

Protected by:

```text
CRON_SECRET
```

### `GET /api/health`

Returns a lightweight operational status payload.

It reports:

- app status
- current runtime mode
- Supabase env readiness
- OpenAI env readiness
- cron secret readiness

This is useful for quick deployment smoke checks.

## Visual Design

The design direction is documented in:

```text
DESIGN.md
```

The current visual system is:

- monochrome dark technical substrate
- strictly monospace typography
- hard 1px borders and square controls
- pixelated glyphs and dither texture
- flat stepped silhouettes
- custom pixel glyph icons
- notched pixel-frame UI panels
- radar/mission/engine language
- large lowercase terminal typography

The goal is for Ascend to feel like:

```text
a futuristic career operating system for student ambition
```

Not:

```text
a school dashboard
a generic SaaS app
a chatbot wrapper
an EdTech landing page
```

## Custom Icon System

The app no longer uses generic icon components for the core UI.

Custom pixel glyphs are defined in:

```text
src/components/design/Glyph.tsx
```

The glyph system supports:

- graph
- quest
- proof
- portfolio
- radar
- check
- close
- clock
- copy
- command
- bell
- lock
- skill
- grant
- milestone
- target
- file
- link

This keeps the interface visually distinct and avoids the generic Lucide/Feather look.

## Local Setup

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is occupied, Next.js will use another port such as `3001`.

## Environment Variables

Create:

```text
.env.local
```

Use:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
CRON_SECRET=
```

Notes:

- `OPENAI_API_KEY` enables live AI generation.
- Supabase variables enable secure persistence and auth.
- Missing env vars do not break the demo because fallback logic is included.
- `CRON_SECRET` protects scheduled jobs.

## Supabase Setup

The local Supabase project is initialized under:

```text
supabase/
```

Login:

```bash
npx supabase login
```

Link remote project:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

Push migrations:

```bash
npx supabase db push
```

Seed opportunities:

```bash
npx supabase db execute --file supabase/seed/001_grants.sql
```

Local Supabase requires Docker:

```bash
npx supabase start
```

If Docker is not running, local Supabase will fail with a Docker daemon error.

## Vercel Deployment

Build locally:

```bash
npm run build
```

Deploy:

```bash
npx vercel --prod --yes
```

Current project:

```text
ascend
```

Production alias:

[https://ascend-virid.vercel.app](https://ascend-virid.vercel.app)

## Development Commands

```bash
npm run dev
npm run check:env
npm run lint
npm run build
npm run verify
npm run start
```

Use `npm run lint` and `npm run build` before pushing.

GitHub Actions runs the same lint/build checks on pushes and pull requests to `main`.

## Acceptance Checklist

The MVP should support:

- user can open landing page
- user can sign in when Supabase is configured
- user can continue in demo mode
- user can complete onboarding
- AI or fallback graph is generated
- graph renders with React Flow
- quest opens from graph
- user can submit proof
- proof is validated
- portfolio artifact is generated
- graph unlocks update
- opportunity matches are shown
- app builds successfully
- app deploys to Vercel

## Known Gaps / Next Work

These are intentionally scoped for the next iteration:

- Supabase file upload UI is designed but not fully wired to a real upload control yet.
- Embedding generation for grants is schema-ready but needs a server job to populate vectors.
- Cron route currently returns planned actions; it can be expanded into real scheduled mutations.
- More quest generation variants can be added for non-founder goals.
- The old immutable Vercel deployments still exist under older `pathfinder-*` URLs, but the active production project is Ascend.

## Troubleshooting

### Supabase says access token missing

Run:

```bash
npx supabase login
```

Then link the project:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

### Local Supabase cannot start

Make sure Docker is running.

```bash
npx supabase status
```

If Docker is unavailable, use the hosted Supabase project instead.

### OpenAI key missing

The app still works. It uses deterministic fallback generation for graph, proof validation, portfolio generation, and opportunity matching.

### Vercel says env file detected

Vercel recommends managing env vars in the Vercel dashboard. This is expected if local env files exist.

### Browser shows an old `pathfinder-*` URL

Use the current Ascend production URL:

[https://ascend-virid.vercel.app](https://ascend-virid.vercel.app)

## Project Status

Ascend is a functional MVP with:

- complete visible product loop
- custom design system
- graph-based progress UI
- AI/fallback generation
- secure persistence architecture
- Supabase migration
- Vercel deployment

The highest-value next step is connecting a live Supabase project and enabling real authenticated persistence end to end.
