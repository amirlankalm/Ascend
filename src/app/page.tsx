import Link from "next/link";
import { Glyph, type GlyphName } from "@/components/design/Glyph";
import { Button } from "@/components/ui/button";
import { Mountains } from "@/components/design/Mountains";

export default function Home() {
  return (
    <main className="mountain-sky relative min-h-screen overflow-hidden text-warm-white">
      <div className="pixel-sun" aria-hidden="true" />
      <div className="pixel-overlay" aria-hidden="true" />
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
      <section className="relative z-10 flex min-h-[calc(100dvh-96px)] items-center justify-center px-6 py-28 text-center md:px-24 xl:px-[120px]">
        <div className="mx-auto max-w-[700px]">
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
      <Mountains />
    </main>
  );
}
