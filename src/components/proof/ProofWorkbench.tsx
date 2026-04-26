"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { EngineStrip } from "@/components/design/EngineStrip";
import { Glyph } from "@/components/design/Glyph";
import { Button } from "@/components/ui/button";
import { Textarea, Input } from "@/components/ui/input";
import { loadSecureState, saveState } from "@/lib/demo/storage";
import { unlockGraphAfterProof } from "@/lib/graph/unlock";
import type { PathfinderState, PortfolioItem, ProofValidation } from "@/types/pathfinder";

const loadingSteps = ["Analyzing proof...", "Extracting skills...", "Updating graph...", "Generating portfolio item..."];
const proofChecks = [
  { label: "At least 80 characters", test: (text: string) => text.trim().length >= 80 },
  { label: "Mentions users or audience", test: (text: string) => /user|student|customer|audience|people|founder/i.test(text) },
  { label: "Mentions AI or product logic", test: (text: string) => /ai|model|prompt|product|startup|prototype/i.test(text) },
  { label: "Includes improvement or insight", test: (text: string) => /improve|insight|feature|ship|change|better/i.test(text) },
];

export function ProofWorkbench({ questId }: { questId: string }) {
  const router = useRouter();
  const [state, setState] = useState<PathfinderState | null>(null);
  const [textProof, setTextProof] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{ validation: ProofValidation; portfolio: PortfolioItem } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    window.setTimeout(() => {
      void loadSecureState().then(setState);
    }, 0);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => setStep((current) => Math.min(loadingSteps.length - 1, current + 1)), 720);
    return () => window.clearInterval(timer);
  }, [loading]);

  const quest = useMemo(() => state?.graph.quests.find((item) => item.id === questId), [questId, state]);
  const passedChecks = proofChecks.filter((check) => check.test(textProof)).length;
  const readiness = Math.round((passedChecks / proofChecks.length) * 100);

  async function submitProof() {
    if (!state || !quest) return;
    setLoading(true);
    setStep(0);
    setError("");

    try {
      const response = await fetch("/api/proof/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, questId, textProof, externalUrl }),
      });
      if (!response.ok) throw new Error("Proof validation failed. Try again with more concrete evidence.");
      const payload = (await response.json()) as { validation: ProofValidation; portfolio: PortfolioItem };
      const nextGraph = unlockGraphAfterProof(state.graph, quest.nodeId, payload.validation);
      const nextState: PathfinderState = {
        ...state,
        graph: nextGraph,
        proofs: [
          ...state.proofs,
          { id: `proof_${Date.now()}`, questId, textProof, externalUrl, validation: payload.validation },
        ],
        portfolio: payload.validation.passed ? [payload.portfolio, ...state.portfolio] : state.portfolio,
        xp: state.xp + (payload.validation.passed ? quest.xpReward : 0),
      };
      saveState(nextState);
      setState(nextState);
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Proof validation failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!state || !quest) {
    return <div className="px-5 py-12 text-ash-muted">Loading mission proof desk...</div>;
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 pt-8 lg:grid-cols-[1fr_390px]">
      <div className="terrain-panel pixel-frame pixel-border p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-sun-orange">Proof engine / validation bay</p>
        <h1 className="mt-4 text-[clamp(3rem,7vw,6.2rem)] font-semibold leading-[0.95]">Submit evidence</h1>
        <p className="mt-4 max-w-2xl leading-7 text-ash-muted">{quest.expectedOutput}</p>
        <div className="mt-6">
          <EngineStrip
            items={[
              { icon: "proof", label: "Evidence", value: `${textProof.trim().length} characters captured` },
              { icon: "scan", label: "Readiness", value: `${readiness}% preflight score` },
              { icon: "portfolio", label: "Output", value: "Validated proof becomes portfolio signal" },
            ]}
          />
        </div>
        <div className="mt-7 space-y-4">
          <Textarea
            value={textProof}
            onChange={(event) => setTextProof(event.target.value)}
            placeholder="Paste your analysis, prototype notes, project link explanation, or reflection here..."
            rows={10}
          />
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <Input value={externalUrl} onChange={(event) => setExternalUrl(event.target.value)} placeholder="Optional URL proof" />
            <Button variant="ghost" disabled>
              <Glyph name="file" size="sm" />
              File upload wired to Supabase Storage
            </Button>
          </div>
          {error && <div className="pixel-frame border border-red-300/40 bg-red-500/10 p-4 text-sm leading-6 text-red-100">{error}</div>}
          <Button onClick={submitProof} disabled={loading || textProof.trim().length < 80}>
            <Glyph name="scan" size="sm" />
            {loading ? loadingSteps[step] : "Validate proof"}
          </Button>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="terrain-panel pixel-frame p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-sun-orange">Preflight checks</p>
          <div className="mt-4 space-y-3">
            {proofChecks.map((check) => {
              const passed = check.test(textProof);
              return (
                <div key={check.label} className="flex items-center justify-between gap-3 border-b border-ember-line/40 pb-2">
                  <span className="text-sm text-ash-muted">{check.label}</span>
                  <Glyph name={passed ? "check" : "close"} size="sm" className={passed ? "text-sun-orange" : "text-ash-muted/50"} />
                </div>
              );
            })}
          </div>
          <div className="mt-5 h-2 bg-black/40">
            <div className="h-full bg-sun-orange transition-all" style={{ width: `${readiness}%` }} />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="terrain-panel pixel-frame p-5"
            >
              <div className="grid h-14 w-14 place-items-center border border-ember-line bg-hot-orange/20 text-sun-orange">
                <Glyph name="scan" size="lg" className="animate-pulse" />
              </div>
              <p className="mt-5 text-xl font-semibold">{loadingSteps[step]}</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/40">
                <div className="h-full rounded-full bg-sun-orange transition-all" style={{ width: `${(step + 1) * 25}%` }} />
              </div>
            </motion.div>
          )}
          {result && !loading && (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="pixel-frame border border-warm-white/60 bg-warm-white p-5 text-near-black">
                <Glyph name={result.validation.passed ? "check" : "close"} size="lg" />
                <h2 className="mt-3 text-2xl font-semibold">{result.validation.passed ? "Proof passed" : "Needs another pass"}</h2>
                <p className="mt-2 leading-6">{result.validation.feedback}</p>
              </div>
              <div className="terrain-panel pixel-frame p-5">
                <div className="grid grid-cols-2 gap-3">
                  <Score label="Validation" value={result.validation.validationScore} />
                  <Score label="Effort" value={result.validation.effortScore} />
                  <Score label="Skill" value={result.validation.skillScore} />
                  <Score label="Authentic" value={result.validation.authenticityScore} />
                </div>
              </div>
              {result.validation.passed && (
                <div className="terrain-panel pixel-frame p-5">
                  <p className="font-mono text-xs uppercase text-sun-orange">Portfolio generated</p>
                  <h3 className="mt-2 text-xl font-semibold">{result.portfolio.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ash-muted">{result.portfolio.cvBullet}</p>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => router.push("/dashboard/graph")}>View unlocks</Button>
                    <Button variant="ghost" onClick={() => router.push("/dashboard/portfolio")}>
                      <Glyph name="link" size="sm" />
                      Portfolio
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </section>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="pixel-frame border border-ember-line bg-black/24 p-4">
      <p className="font-mono text-[10px] uppercase text-ash-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
