"use client";

import { useEffect, useState } from "react";
import { EngineStrip } from "@/components/design/EngineStrip";
import { Glyph } from "@/components/design/Glyph";
import { Button } from "@/components/ui/button";
import { loadSecureState } from "@/lib/demo/storage";
import type { PathfinderState } from "@/types/pathfinder";

export function PortfolioGrid() {
  const [state, setState] = useState<PathfinderState | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    window.setTimeout(() => {
      void loadSecureState().then(setState);
    }, 0);
  }, []);

  const items = state?.portfolio ?? [];
  const skills = Array.from(new Set(items.flatMap((item) => item.skills)));
  const averageImpact = items.length ? Math.round(items.reduce((sum, item) => sum + item.impactScore, 0) / items.length) : 0;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-8">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-sun-orange">Portfolio engine / signal forge</p>
      <h1 className="mt-4 max-w-4xl text-[clamp(3rem,7vw,6.4rem)] font-normal lowercase leading-[0.95] tracking-[-0.02em]">proof becomes public signal.</h1>
      <div className="mt-7">
        <EngineStrip
          items={[
            { icon: "portfolio", label: "Artifacts", value: `${items.length} generated portfolio items` },
            { icon: "skill", label: "Skills", value: `${skills.length} demonstrated skills tracked` },
            { icon: "target", label: "Signal", value: `${averageImpact || 0} average impact score` },
          ]}
        />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          {items.length === 0 ? (
            <div className="terrain-panel pixel-frame p-8 text-ash-muted">Validate a quest proof to generate your first CV-ready artifact.</div>
          ) : (
            items.map((item) => (
              <article key={item.id} className="pixel-frame pixel-border relative overflow-hidden border border-ember-line bg-warm-white p-6 text-near-black">
                <div className="absolute right-0 top-0 h-28 w-28 border-l border-b border-near-black/20" />
                <div className="flex items-start justify-between gap-4">
                  <Glyph name="portfolio" size="lg" />
                  <div className="font-mono text-xs">{item.impactScore} impact</div>
                </div>
                <h2 className="mt-5 text-2xl font-normal lowercase tracking-[-0.02em]">{item.title}</h2>
                <p className="mt-3 leading-7">{item.summary}</p>
                <div className="pixel-frame mt-5 bg-near-black p-4 text-warm-white">
                  <p className="font-mono text-[10px] uppercase text-sun-orange">CV bullet</p>
                  <p className="mt-2 text-sm leading-6">{item.cvBullet}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="pixel-chip border-near-black/20 bg-warm-white px-3 py-1 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  className="mt-5 border-near-black/20 bg-near-black text-warm-white hover:bg-near-black/85"
                  variant="ghost"
                  onClick={() => {
                    void navigator.clipboard.writeText(item.cvBullet);
                    setCopied(item.id);
                    window.setTimeout(() => setCopied(null), 1400);
                  }}
                >
                  <Glyph name={copied === item.id ? "check" : "copy"} size="sm" />
                  {copied === item.id ? "Copied" : "Copy bullet"}
                </Button>
              </article>
            ))
          )}
        </div>
        <aside className="terrain-panel pixel-frame p-5">
          <h2 className="text-xl font-normal lowercase tracking-[-0.02em]">accumulated skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.length ? skills.map((skill) => <span key={skill} className="pixel-chip px-3 py-1 text-xs text-ash-muted">{skill}</span>) : <p className="text-sm text-ash-muted">No validated skills yet.</p>}
          </div>
          <div className="mt-6 border-t border-ember-line pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sun-orange">Export pack</p>
            <p className="mt-2 text-sm leading-6 text-ash-muted">Use these artifacts for CV bullets, scholarship essays, hackathon bios, and mentor updates.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
