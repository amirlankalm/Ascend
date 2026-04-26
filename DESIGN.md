# Ascend Design System

## 1. Visual Philosophy
Ascend is a frontier operating system for student ambition. It should feel like an expedition map from an AI lab: cinematic orange atmosphere, dark mountain silhouettes, precise interface surfaces, and graph nodes that feel like future unlocks rather than school tasks. The product avoids classroom dashboards, cute gamification, and generic SaaS cards.

## 2. Layout System
- Desktop shell: 96-120px horizontal page padding for public pages, 20-28px for app workspaces.
- Navigation: 88px tall, positioned roughly 40-50px from top on cinematic screens.
- Landing hero: almost full viewport with content beginning near 200px from left and headline around 330px from top on a 2048x1040 reference.
- Dashboard: spatial canvas first. Graph occupies nearly the whole screen; side panels are overlays, not boxed page sections.
- Content max widths: 760px for hero copy, 1120px for structured forms, full bleed for graph.

## 3. Color Tokens
- `sun-orange`: `#F5A400`
- `core-orange`: `#F08A00`
- `hot-orange`: `#FF6A00`
- `deep-orange`: `#D84A00`
- `burnt-orange`: `#8A2A00`
- `mountain-dark`: `#3A1306`
- `near-black`: `#070707`
- `warm-white`: `#FFF7EA`
- `glass-white`: `rgba(255,255,255,0.10)`
- `ember-line`: `rgba(255,196,112,0.36)`
- `ash-muted`: `rgba(255,247,234,0.64)`

## 4. Typography Scale
- Font: Geist Sans for all interface text, Geist Mono for IDs, scores, XP, and compact telemetry.
- Display desktop: 88-104px, line-height 1.0.
- Display tablet: 64-76px.
- Display mobile: 44-56px.
- Subtitle desktop: 28-34px.
- Section title: 28-40px.
- Body: 16px.
- Caption: 12-13px.
- Letter spacing: 0.

## 5. Spacing Scale
- 4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96, 120.
- Dense product controls use 8-16px gaps.
- Cinematic pages use 40-96px gaps and large empty fields.

## 6. Component Specs
- `MountainHero`: full viewport orange radial + linear gradient, SVG/CSS layered mountains in the bottom half, huge white type, underlined minimal CTAs.
- `AppShell`: dark expedition map surface with top nav, compact progress/XP telemetry, persistent section navigation.
- `GlassPanel`: translucent dark-orange surface with 1px ember border and restrained blur.
- `QuestCard`: mission brief layout with XP, time, difficulty, rubric, and one primary action.
- `ProofScoreCard`: compact score tile with animated validation flash.
- `PortfolioCard`: artifact-style document panel with copyable CV bullet.
- `GrantCard`: opportunity panel that reads like a radar hit, with deadline and next action.

## 7. Graph Node Design
- Goal nodes: large warm-white core with orange corona.
- Skill nodes: angular dark panels with amber outline.
- Quest nodes: active mission beacons with pulsing edge glow when available.
- Proof nodes: artifact/document shape with folded-corner visual.
- Portfolio nodes: polished ivory document nodes.
- Grant/opportunity nodes: treasure/radar nodes in gold-orange.
- Locked nodes: dim, low saturation, dashed border.
- Completed nodes: warm white check mark and stable glow.

## 8. Motion System
- Page transitions: opacity + 12px y movement, 220-360ms.
- Hero gradient: slow 18-24s background-position drift.
- Mountain parallax: subtle translate transforms by layer.
- Graph edge flow: animated stroke dash offset.
- Active node pulse: low-frequency orange halo.
- Unlock pop: scale 0.92 to 1 with opacity and glow flash.
- Proof validation: staged loading text: analyzing proof, extracting skills, updating graph, generating portfolio.

## 9. Responsive Behavior
- Mobile landing keeps the hero first and preserves mountain depth; type clamps to 44-56px.
- Dashboard switches to a top graph with bottom/detail panels; no critical graph controls are hidden.
- Forms become single column and keep action buttons visible without overlap.
- Fixed-format elements such as node cards, toolbar buttons, and score tiles use stable dimensions.

## 10. Tailwind Token Mapping
- CSS variables live in `globals.css` and are exposed through Tailwind v4 `@theme inline`.
- Use classes like `bg-background`, `text-foreground`, `text-warm-white`, `border-ember-line`, and custom utility classes for mountain gradients.
- Avoid one-note orange blocks by pairing warm orange atmosphere with near-black, ivory document surfaces, amber outlines, and muted ash text.
