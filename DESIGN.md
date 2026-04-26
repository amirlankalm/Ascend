# Ascend Design System

## 1. Visual Philosophy
Ascend is a developer-centric career operating system for high school execution. The interface should feel like a serious technical instrument: part terminal, part tactical graph debugger, part proof ledger.

The design is intentionally strict:
- No gradients.
- No soft drop shadows.
- No glassmorphism.
- No vibrant accent colors.
- No rounded consumer UI.
- No standard sans-serif typography.

Hierarchy comes from contrast, grayscale values, visible grid structure, generous spacing, typographic scale, and pixel-level marks.

## 2. Layout System
- Public hero pages are centered, focused, and quiet with 120px+ vertical padding.
- Reading columns are constrained to 650-700px.
- App workspaces use a top navigation rail and full-screen spatial canvases.
- Graph screens prioritize the map; text overlays are compact and pointer-safe.
- Detail views use rigid two-column layouts on desktop and single-column stacks on mobile.
- Distinct functional zones are separated with 1px borders and 32-48px gaps.

## 3. Color Tokens
- `background`: `#0A0A0A`
- `surface`: `#161616`
- `surface-2`: `#1A1A1A`
- `surface-3`: `#111111`
- `foreground`: `#EDEDED`
- `primary`: `#F5F5F5`
- `secondary`: `#A1A1AA`
- `tertiary`: `#525252`
- `border`: `#333333`
- `border-soft`: `#2A2A2A`
- `inverse`: `#0A0A0A`

No warm/orange/accent token names should be used for new UI. The app surface is plain off-black, and status is communicated through white/gray contrast only.

## 4. Typography Scale
- Font: Geist Mono everywhere.
- Display desktop: `clamp(3rem, 7vw, 6.7rem)`.
- Display mobile: `clamp(3rem, 12vw, 4.2rem)`.
- Hero and page headings are lowercase, weight 400, line-height 0.95-1.0, letter-spacing `-0.02em`.
- Body copy is weight 400, size 16px, line-height 1.6, color `secondary`.
- Metadata labels are uppercase, 10-12px, letter-spacing 0.16-0.24em.
- Numbers use tabular figures.

## 5. Spacing Scale
- Base units: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96, 120.
- Dense telemetry controls use 8-16px internal rhythm.
- Major sections use 32-48px gaps.
- Hero and onboarding moments use large vertical space to force focus.

## 6. Component Specs
- `AppShell`: monochrome grid substrate, top nav, pixel glyph logo, search block, XP telemetry.
- `Button`: primary is white background with black text; secondary is transparent with a 1px gray border.
- `Input` / `Textarea`: `#161616` background, `#333333` border, square corners.
- `EngineStrip`: bordered telemetry strip with three rigid cells.
- `PathGraph`: full-screen graph canvas with flat nodes, dashed animated edges, and monochrome status.
- `CustomGraphNode`: square proof/quest/skill node with 1px border, mono metadata, and no glow.
- `ProofWorkbench`: validation bay with preflight checks, progress bars, and portfolio output.
- `PortfolioCard`: document-like artifact panel with copyable CV bullet.
- `GrantCard`: opportunity record with match score, deadline, missing proof, and next action.

## 7. Graph Node Design
- Locked nodes: `surface-3`, low opacity, grayscale, lock glyph.
- Available nodes: `surface-2`, white border, active but not colorful.
- In-progress nodes: white border, solid technical surface.
- Completed nodes: inverted white surface with black text.
- Quest nodes and proof nodes use pixel glyphs instead of generic icon libraries.
- Edges use grayscale dashed strokes; funding edges are brighter than dependency edges.

## 8. Motion System
- Motion is mechanical, not cinematic.
- Page and panel transitions use opacity plus small y/x offsets.
- Graph edges animate with stepped dash movement.
- Radar scan is a single hard white line rotating inside a square field.
- Button active state moves 1px down.
- Loading states progress through explicit text: analyzing proof, extracting skills, updating graph, generating portfolio.

## 9. Responsive Behavior
- Top nav remains the primary shell; crowded right-side telemetry can hide on smaller widths.
- Graph panels use fixed node dimensions so labels and handles do not shift layout.
- Quest, proof, portfolio, and radar pages collapse to one column below desktop.
- Text blocks keep readable max widths and avoid full-width paragraphs.
- Controls never depend on hover alone; focus states use a 1px white outline.

## 10. Tailwind Token Mapping
- Tailwind v4 tokens live in `src/app/globals.css` under `@theme inline`.
- Use `bg-background`, `bg-surface`, `text-warm-white`, `text-ash-muted`, and `border-ember-line`.
- Avoid new color tokens unless they are grayscale.
- Do not add gradients, shadows, blur, or rounded corners.
- Preserve pixel glyphs and notched square frames for the custom Ascend identity, but do not use decorative grid-square backgrounds.
