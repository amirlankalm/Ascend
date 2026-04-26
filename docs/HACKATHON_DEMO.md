# Ascend Hackathon Demo Script

This file is the judge-facing walkthrough for the MVP. It explains what to click, what should happen, and why the product is more than a static roadmap or chatbot.

## One-Sentence Pitch

Ascend turns a high school student’s vague ambition into a living graph of quests, proof, portfolio artifacts, and opportunity matches.

## Demo Goal

Use the default onboarding path:

```text
I want to become an AI founder.
```

Default profile:

- 15 years old
- Kazakhstan
- interested in startups, AI, and research
- beginner/intermediate confidence
- 30 minutes per day
- some olympiad/project experience

## What Judges Should See

The product loop is:

```text
Goal -> Graph -> Quest -> Proof -> Validation -> Portfolio -> Unlocks -> Opportunities
```

The key point is that Ascend does not just recommend content. It asks the student to do work, validates that work, converts it into credible signal, and updates the graph.

## Walkthrough

### 1. Landing Page

Open:

```text
/
```

Expected impression:

- cinematic orange/pixel frontier visual language
- product feels like a career operating system, not a school dashboard
- clear action: generate a graph

### 2. Onboarding

Open:

```text
/onboarding
```

Use the defaults or enter:

```text
Goal: I want to become an AI founder.
City: Almaty
Country: Kazakhstan
Interests: startups, AI, research
Time: 30
```

Click:

```text
Generate path
```

Expected result:

- `/api/graph` runs
- OpenAI generates a graph when configured
- deterministic fallback graph is used when OpenAI is not configured
- graph state is stored in Supabase when authenticated
- graph state falls back to browser storage when unauthenticated

### 3. Graph Dashboard

Open:

```text
/dashboard/graph
```

Expected result:

- React Flow graph renders
- nodes show locked, available, and completed statuses
- edges animate
- graph has career goal, skill, quest, proof, portfolio, grant, milestone, and discovery nodes
- clicking a node opens a detail panel

What to explain:

```text
This is the student's living progress map. Nodes are not static advice; they unlock based on proof.
```

### 4. Quest Detail

Open:

```text
/dashboard/quest/quest_startup_scan
```

Expected result:

- quest page shows mission telemetry
- proof output is concrete and time-boxed
- pass criteria are visible
- proof template helps the student submit something specific

Example quest:

```text
Analyze 3 AI startups.
For each: problem, user, why AI matters, and one feature improvement.
```

### 5. Submit Proof

Open:

```text
/dashboard/proof/quest_startup_scan
```

Paste proof like:

```text
I reviewed Perplexity, Cursor, and Harvey. Perplexity helps students and professionals research faster with citations. The target user is someone replacing multiple search tabs with one answer engine. AI matters because it summarizes, compares sources, and keeps context. I would improve it with a student mode that explains source reliability. Cursor helps developers and students code faster by editing code in context. I would improve onboarding for absolute beginners. Harvey helps law firms draft and research across large documents. I would improve explainability for non-lawyers. In Kazakhstan, a strong founder opportunity is an AI scholarship and olympiad navigator for students who miss deadlines.
```

Expected result:

- preflight checks update
- validation runs
- scores are shown
- feedback is generated
- portfolio item appears when proof passes
- graph unlocks update

### 6. Portfolio

Open:

```text
/dashboard/portfolio
```

Expected result:

- validated proof becomes a portfolio artifact
- generated CV bullet can be copied
- skills are accumulated
- artifact includes impact/polish scoring

What to explain:

```text
Ascend packages student work into usable application material without inventing fake achievements.
```

### 7. Opportunities

Open:

```text
/dashboard/opportunities
```

Expected result:

- radar cards show grant/competition/program matches
- match score is visible
- missing proof is visible
- next action is visible
- filters show all, ready, and urgent lanes

What to explain:

```text
Opportunities are matched against the graph and proof, not just listed as a directory.
```

## Fallback Behavior

The demo is intentionally resilient:

- no OpenAI key: fallback graph/proof/portfolio generation works
- no Supabase auth: local browser state works
- no Supabase project: migration files still show production schema

This keeps the product demo reliable under hackathon conditions.

## Judge Talking Points

- The graph is the core product surface.
- Quests are concrete, time-boxed, and proof-producing.
- Proof validation is supportive but honest.
- Portfolio generation creates usable student signal.
- Opportunity matching gives the next application move.
- Supabase schema is production-oriented with RLS and private storage.
- Design is custom: pixel glyphs, graph OS layout, orange frontier atmosphere.

## Current Production URL

[https://ascend-virid.vercel.app](https://ascend-virid.vercel.app)

