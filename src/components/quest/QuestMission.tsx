"use client";

import Link from "next/link";
import { EngineStrip } from "@/components/design/EngineStrip";
import { Glyph } from "@/components/design/Glyph";
import { Button } from "@/components/ui/button";
import type { Quest } from "@/types/pathfinder";

export function QuestMission({ quest }: { quest: Quest }) {
  return (
    <article className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 pt-8 lg:grid-cols-[1fr_380px]">
      <section className="terrain-panel pixel-frame pixel-border p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-sun-orange">Quest engine / today’s mission</p>
        <h1 className="mt-4 max-w-4xl text-[clamp(3rem,7vw,6.4rem)] font-normal lowercase leading-[0.95] tracking-[-0.02em]">{quest.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ash-muted">{quest.whyItMatters}</p>
        <div className="mt-7">
          <EngineStrip
            items={[
              { icon: "clock", label: "Time box", value: `${quest.timeEstimate} minutes, one focused sprint` },
              { icon: "bolt", label: "Reward", value: `${quest.xpReward} XP and one proof artifact` },
              { icon: "target", label: "Unlock logic", value: "Pass validation to open proof, portfolio, and next skill nodes" },
            ]}
          />
        </div>
        <div className="pixel-frame mt-8 border border-ember-line bg-surface-3 p-5">
          <h2 className="flex items-center gap-2 text-lg font-normal lowercase tracking-[-0.02em]">
            <Glyph name="quest" size="md" className="text-warm-white" />
            mission brief
          </h2>
          <p className="mt-3 leading-7 text-ash-muted">{quest.instructions}</p>
        </div>
        <div className="pixel-frame mt-6 border border-ember-line bg-warm-white p-5 text-near-black">
          <h2 className="flex items-center gap-2 text-lg font-normal lowercase tracking-[-0.02em]">
            <Glyph name="proof" size="md" />
            expected output
          </h2>
          <p className="mt-2 leading-7">{quest.expectedOutput}</p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {["Name concrete examples", "Explain user + AI advantage", "Add one original local insight"].map((item, index) => (
            <div key={item} className="pixel-frame border border-ember-line bg-surface-3 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sun-orange">Proof block {index + 1}</p>
              <p className="mt-2 text-sm leading-6 text-ash-muted">{item}</p>
            </div>
          ))}
        </div>
        <Link href={`/dashboard/proof/${quest.id}`} className="mt-7 inline-flex">
          <Button>
            <Glyph name="arrow" size="sm" />
            Submit proof
          </Button>
        </Link>
      </section>
      <aside className="space-y-4">
        <div className="terrain-panel pixel-frame p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-sun-orange">Mission telemetry</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat icon="clock" label="Time" value={`${quest.timeEstimate} min`} />
            <Stat icon="bolt" label="Reward" value={`${quest.xpReward} XP`} />
          </div>
        </div>
        <div className="terrain-panel pixel-frame p-5">
          <h2 className="flex items-center gap-2 text-lg font-normal lowercase tracking-[-0.02em]">
            <Glyph name="check" size="md" className="text-warm-white" />
            pass criteria
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ash-muted">
            {quest.evaluationRubric.map((item) => (
              <li key={item} className="border-l border-warm-white/70 pl-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="terrain-panel pixel-frame p-5">
          <h2 className="text-lg font-normal lowercase tracking-[-0.02em]">skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {quest.relatedSkills.map((skill) => (
              <span key={skill} className="pixel-chip px-3 py-1 text-xs text-ash-muted">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="terrain-panel pixel-frame p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-sun-orange">Proof template</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-ash-muted">
            <p>1. Product or example name</p>
            <p>2. User problem and why it matters</p>
            <p>3. What AI changes about the workflow</p>
            <p>4. One concrete improvement you would ship</p>
          </div>
        </div>
      </aside>
    </article>
  );
}

function Stat({ icon, label, value }: { icon: "clock" | "bolt"; label: string; value: string }) {
  return (
    <div className="pixel-frame border border-ember-line bg-surface-3 p-4">
      <Glyph name={icon} size="sm" className="text-warm-white" />
      <p className="mt-3 font-mono text-[10px] uppercase text-ash-muted">{label}</p>
      <p className="mt-1 text-lg font-normal">{value}</p>
    </div>
  );
}
