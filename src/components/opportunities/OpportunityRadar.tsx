"use client";

import { useEffect, useState } from "react";
import { EngineStrip } from "@/components/design/EngineStrip";
import { Glyph } from "@/components/design/Glyph";
import { Button } from "@/components/ui/button";
import { loadSecureState, saveState } from "@/lib/demo/storage";
import type { OpportunityMatch, PathfinderState } from "@/types/pathfinder";

const URGENCY_ANCHOR_MS = 1777075200000; // 2026-04-25 UTC, aligned with the hackathon demo timeline.
const NINETY_DAYS_MS = 1000 * 60 * 60 * 24 * 90;

export function OpportunityRadar() {
  const [state, setState] = useState<PathfinderState | null>(null);
  const [matches, setMatches] = useState<OpportunityMatch[]>([]);
  const [filter, setFilter] = useState<"all" | "ready" | "urgent">("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      void loadSecureState().then((loaded) => {
        setState(loaded);
        setMatches(loaded.opportunities);
      });
    }, 0);
  }, []);

  async function refresh() {
    if (!state) return;
    setRefreshing(true);
    try {
      const response = await fetch("/api/opportunities/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      const payload = (await response.json()) as { matches: OpportunityMatch[] };
      const next = { ...state, opportunities: payload.matches };
      saveState(next);
      setState(next);
      setMatches(payload.matches);
    } finally {
      setRefreshing(false);
    }
  }

  const filteredMatches = matches.filter((match) => {
    if (filter === "ready") return match.matchScore >= 90;
    if (filter === "urgent") return new Date(match.opportunity.deadline).getTime() - URGENCY_ANCHOR_MS < NINETY_DAYS_MS;
    return true;
  });
  const urgentCount = matches.filter((match) => new Date(match.opportunity.deadline).getTime() - URGENCY_ANCHOR_MS < NINETY_DAYS_MS).length;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-sun-orange">Opportunity engine / live scan</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(3rem,7vw,6.7rem)] font-normal lowercase leading-[0.95] tracking-[-0.02em]">
            your future signals, ranked.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ash-muted">
            Ascend reads validated proof, graph unlocks, and founder direction, then turns them into application moves.
          </p>
          <div className="mt-7 max-w-3xl">
            <EngineStrip
              items={[
                { icon: "target", label: "Matches", value: `${matches.length || 0} opportunities in radar memory` },
                { icon: "check", label: "Ready", value: `${matches.filter((match) => match.matchScore >= 90).length} high-fit application lanes` },
                { icon: "clock", label: "Urgent", value: `${urgentCount} deadlines inside 90 days` },
              ]}
            />
          </div>
        </div>
        <div className="terrain-panel pixel-frame overflow-hidden p-5">
          <div className="relative mx-auto grid aspect-square max-w-[260px] place-items-center border border-ember-line bg-surface-3">
            <div className="absolute inset-4 border border-border-soft" />
            <div className="absolute inset-12 border border-border-soft" />
            <div className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom animate-spin bg-warm-white" />
            <Glyph name="radar" size="xl" className="text-warm-white" />
          </div>
          <Button onClick={refresh} className="mt-5 w-full">
            <Glyph name="scan" size="sm" />
            {refreshing ? "Scanning graph..." : "Refresh semantic scan"}
          </Button>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {[
          ["all", "All signals"],
          ["ready", "Ready now"],
          ["urgent", "Deadline heat"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key as "all" | "ready" | "urgent")}
            className={`pixel-chip px-4 py-2 text-sm lowercase transition ${filter === key ? "bg-sun-orange text-near-black" : "text-ash-muted hover:bg-surface-2 hover:text-warm-white"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4">
        {!state && <div className="terrain-panel pixel-frame p-8 text-ash-muted">Loading opportunity radar...</div>}
        {state && filteredMatches.length === 0 && (
          <div className="terrain-panel pixel-frame p-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-sun-orange">No signals in this lane</p>
            <p className="mt-3 max-w-xl text-ash-muted">Complete another quest or refresh matches after portfolio proof is generated.</p>
          </div>
        )}
        {filteredMatches.map((match) => (
          <article key={match.id} className="terrain-panel pixel-frame pixel-border overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[190px_1fr_280px]">
              <div className="relative min-h-44 border-b border-ember-line p-5 lg:border-b-0 lg:border-r">
                <div className="absolute inset-0 border-r border-border-soft" />
                <div className="relative grid h-28 w-28 place-items-center border border-warm-white bg-surface font-mono text-4xl text-warm-white">
                  {match.matchScore}
                  <span className="absolute -bottom-2 border border-ember-line bg-near-black px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ash-muted">
                    match
                  </span>
                </div>
                <p className="relative mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-ash-muted">Semantic fit</p>
              </div>
              <div className="p-5 md:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="pixel-chip px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-sun-orange">
                    {match.opportunity.provider}
                  </span>
                  <span className="pixel-chip px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ash-muted">
                    {match.opportunity.countryRegion}
                  </span>
                </div>
                <h2 className="mt-4 max-w-2xl text-3xl font-normal lowercase leading-tight tracking-[-0.02em] md:text-4xl">{match.opportunity.title}</h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-ash-muted">{match.reason}</p>
                <div className="pixel-frame mt-5 border border-ember-line bg-surface-3 p-4">
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sun-orange">
                    <Glyph name="target" size="xs" />
                    Next unlock action
                  </p>
                  <p className="mt-2 text-sm leading-6 text-warm-white">{match.nextAction}</p>
                </div>
              </div>
              <div className="border-t border-ember-line p-5 lg:border-l lg:border-t-0">
                <div className="pixel-frame border border-ember-line bg-warm-white p-4 text-near-black">
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                    <Glyph name="clock" size="xs" />
                    Deadline
                  </p>
                  <p className="mt-2 text-2xl font-normal">{match.opportunity.deadline}</p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em]">Amount</p>
                  <p className="mt-1 text-sm">{match.opportunity.amount}</p>
                </div>
                <div className="mt-4">
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sun-orange">
                    <Glyph name="proof" size="xs" />
                    Missing proof
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-ash-muted">
                    {match.missingRequirements.map((item) => (
                      <li key={item} className="border-l border-warm-white/50 pl-3">{item}</li>
                    ))}
                  </ul>
                </div>
                <a href={match.opportunity.url} className="mt-5 inline-flex items-center gap-2 text-sm underlined-action">
                  Inspect opportunity brief
                  <Glyph name="arrow" size="sm" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
