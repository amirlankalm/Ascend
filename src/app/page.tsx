import Link from "next/link";
import { Glyph, type GlyphName } from "@/components/design/Glyph";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="app-surface relative min-h-screen overflow-hidden text-warm-white">
      <header className="relative z-10 flex h-24 items-center justify-between border-b border-ember-line px-6 md:px-24">
        <Link href="/" className="text-lg font-normal lowercase tracking-[-0.02em]">
          ascend
        </Link>
        <nav className="flex items-center gap-8 text-sm">
          <Link href="/auth" className="hidden text-warm-white/80 hover:text-warm-white md:block">
            login
          </Link>
          <Link href="/onboarding">
            <Button variant="line" className="px-0">
              <Glyph name="arrow" size="sm" />
              start path
            </Button>
          </Link>
        </nav>
      </header>
      <section className="relative z-10 flex min-h-[calc(100dvh-96px)] items-center justify-center px-6 py-20 text-center md:px-24 xl:px-[120px]">
        {/* mountain silhouette */}
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="xMidYMax meet"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full select-none opacity-[0.07]"
          aria-hidden
        >
          <path
            d="M0,220 L0,160 L120,90 L240,140 L360,50 L480,120 L560,70 L660,130 L760,30 L880,110 L980,60 L1080,125 L1180,55 L1300,100 L1440,70 L1440,220 Z"
            fill="currentColor"
          />
          <path
            d="M0,220 L0,180 L180,130 L320,160 L440,100 L560,145 L700,90 L840,150 L960,95 L1100,140 L1260,100 L1440,130 L1440,220 Z"
            fill="currentColor"
            className="opacity-60"
          />
        </svg>
        <div className="relative z-10 mx-auto max-w-[700px]">
          <div className="pixel-chip mb-10 inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.18em] text-ash-muted">
            <Glyph name="ascend" size="sm" />
            ai-native digital social elevator
          </div>
          <h1 className="max-w-[760px] text-[clamp(3.2rem,8vw,6.5rem)] font-normal lowercase leading-none tracking-[-0.02em]">
            frontier ambition. in your hands.
          </h1>
          <p className="mx-auto mt-8 max-w-[650px] text-base leading-[1.6] text-ash-muted md:text-lg">
            Ascend turns vague goals into executable paths: quests, proof, portfolio signal, and opportunity unlocks.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-10">
            <Link href="/onboarding" className="group inline-flex items-center gap-3 text-xl underline decoration-warm-white/60 underline-offset-8">
              generate my graph
              <Glyph name="arrow" size="md" className="transition group-hover:translate-x-1" />
            </Link>
            <Link href="/dashboard/graph" className="inline-flex items-center gap-3 text-xl underline decoration-warm-white/60 underline-offset-8">
              <Glyph name="graph" size="md" />
              view demo path
            </Link>
          </div>
        </div>
      </section>
      <section className="relative z-10 grid gap-px border-y border-ember-line bg-border md:grid-cols-3">
        {([
          ["Path Engine", "A live graph that converts goals into skills, quests, proof, and unlocks.", "graph"],
          ["Proof Engine", "Validation that rewards concrete student work instead of vague intent.", "proof"],
          ["Opportunity Radar", "Semantic matches to grants, programs, competitions, and next actions.", "radar"],
        ] as Array<[string, string, GlyphName]>).map(([title, body, icon]) => (
          <div key={title} className="pixel-frame bg-surface p-6 md:p-8">
            <Glyph name={icon} size="md" />
            <h2 className="mt-6 text-2xl font-normal lowercase">{title}</h2>
            <p className="mt-3 max-w-sm leading-7 text-ash-muted">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
