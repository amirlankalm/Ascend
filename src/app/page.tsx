import Link from "next/link";
import { Glyph, type GlyphName } from "@/components/design/Glyph";
import { Button } from "@/components/ui/button";
import { Mountains } from "@/components/design/Mountains";

export default function Home() {
  return (
    <main className="mountain-sky relative min-h-screen overflow-hidden text-warm-white">
      <div className="pixel-sun" aria-hidden="true" />
      <div className="pixel-overlay" aria-hidden="true" />
      <header className="relative z-10 flex h-24 items-center justify-between px-6 md:px-24">
        <Link href="/" className="text-lg font-semibold">
          Ascend
        </Link>
        <nav className="flex items-center gap-8 text-sm">
          <Link href="/auth" className="hidden text-warm-white/80 hover:text-warm-white md:block">
            Login
          </Link>
          <Link href="/onboarding">
            <Button variant="line" className="px-0">
              <Glyph name="arrow" size="sm" />
              Start path
            </Button>
          </Link>
        </nav>
      </header>
      <section className="relative z-10 px-6 pt-20 md:px-24 md:pt-32 xl:px-[120px]">
        <div className="max-w-[820px]">
          <div className="pixel-chip mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm backdrop-blur">
            <Glyph name="ascend" size="sm" />
            AI-native digital social elevator
          </div>
          <h1 className="max-w-[820px] text-[clamp(3.4rem,8vw,6.8rem)] font-semibold leading-none">
            Frontier ambition. In your hands.
          </h1>
          <p className="mt-8 max-w-2xl text-[clamp(1.35rem,2.6vw,2.1rem)] leading-tight text-warm-white/88">
            Ascend turns vague goals into executable paths: quests, proof, portfolio signal, and opportunity unlocks.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-10">
            <Link href="/onboarding" className="group inline-flex items-center gap-3 text-xl underline decoration-warm-white/60 underline-offset-8">
              Generate my graph
              <Glyph name="arrow" size="md" className="transition group-hover:translate-x-1" />
            </Link>
            <Link href="/dashboard/graph" className="inline-flex items-center gap-3 text-xl underline decoration-warm-white/60 underline-offset-8">
              <Glyph name="graph" size="md" />
              View demo path
            </Link>
          </div>
        </div>
      </section>
      <section className="relative z-10 mt-28 grid gap-px border-y border-warm-white/18 bg-warm-white/18 md:grid-cols-3">
        {([
          ["Path Engine", "A live graph that converts goals into skills, quests, proof, and unlocks.", "graph"],
          ["Proof Engine", "Validation that rewards concrete student work instead of vague intent.", "proof"],
          ["Opportunity Radar", "Semantic matches to grants, programs, competitions, and next actions.", "radar"],
        ] as Array<[string, string, GlyphName]>).map(([title, body, icon]) => (
          <div key={title} className="pixel-frame bg-black/28 p-6 backdrop-blur md:p-8">
            <Glyph name={icon} size="md" />
            <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
            <p className="mt-3 max-w-sm leading-7 text-warm-white/78">{body}</p>
          </div>
        ))}
      </section>
      <Mountains />
    </main>
  );
}
