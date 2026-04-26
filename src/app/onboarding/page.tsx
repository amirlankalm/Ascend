"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EngineStrip } from "@/components/design/EngineStrip";
import { Glyph } from "@/components/design/Glyph";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { saveState } from "@/lib/demo/storage";
import type { GoalInput, PathfinderState, ProfileInput } from "@/types/pathfinder";

const steps = ["Signal", "Context", "Constraints"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileInput>({
    age: 15,
    city: "Almaty",
    country: "Kazakhstan",
    school: "NIS",
    grade: "10",
    interests: ["startups", "AI", "research"],
    dailyAvailableTime: 30,
    confidenceLevel: "intermediate",
    achievements: "Some olympiad/project experience",
  });
  const [goal, setGoal] = useState<GoalInput>({
    goal: "I want to become an AI founder.",
    targetRole: "AI founder",
    motivation: "I want to build useful AI products and win opportunities.",
    constraints: "30 minutes per day and school workload.",
  });

  async function generate() {
    setLoading(true);
    const response = await fetch("/api/graph", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, goal }),
    });
    const payload = (await response.json()) as PathfinderState;
    saveState(payload);
    router.push("/dashboard/graph");
  }

  return (
    <main className="app-surface relative min-h-screen overflow-hidden px-5 py-8 text-warm-white">
      <section className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <p className="text-lg font-normal lowercase tracking-[-0.02em]">ascend</p>
          <div className="flex gap-2">
            {steps.map((item, index) => (
              <div key={item} className={`h-2 w-14 border border-ember-line ${index <= step ? "bg-warm-white" : "bg-surface-2"}`} />
            ))}
          </div>
        </div>
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="terrain-panel pixel-frame pixel-border p-6 md:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-warm-white">{steps[step]}</p>
          {step === 0 && (
            <div className="mt-5 grid gap-5">
              <h1 className="text-4xl font-normal lowercase leading-none tracking-[-0.02em] md:text-6xl">what future are you trying to reach?</h1>
              <EngineStrip
                items={[
                  { icon: "target", label: "Goal", value: "Be specific enough for the AI graph to make real quests" },
                  { icon: "quest", label: "Mission", value: "Every path begins with a proof-producing action" },
                  { icon: "radar", label: "Radar", value: "Location and context unlock better opportunity matches" },
                ]}
              />
              <Textarea value={goal.goal} onChange={(event) => setGoal({ ...goal, goal: event.target.value })} />
              <Input value={goal.targetRole} onChange={(event) => setGoal({ ...goal, targetRole: event.target.value })} placeholder="Target role" />
              <Textarea value={goal.motivation} onChange={(event) => setGoal({ ...goal, motivation: event.target.value })} placeholder="Why this matters" />
            </div>
          )}
          {step === 1 && (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} placeholder="City" />
              <Input value={profile.country} onChange={(event) => setProfile({ ...profile, country: event.target.value })} placeholder="Country" />
              <Input value={profile.school} onChange={(event) => setProfile({ ...profile, school: event.target.value })} placeholder="School" />
              <Input value={profile.grade} onChange={(event) => setProfile({ ...profile, grade: event.target.value })} placeholder="Grade" />
              <Input value={profile.age} type="number" onChange={(event) => setProfile({ ...profile, age: Number(event.target.value) })} placeholder="Age" />
              <Input value={profile.interests.join(", ")} onChange={(event) => setProfile({ ...profile, interests: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="Interests" />
            </div>
          )}
          {step === 2 && (
            <div className="mt-5 grid gap-5">
              <Input value={profile.dailyAvailableTime} type="number" onChange={(event) => setProfile({ ...profile, dailyAvailableTime: Number(event.target.value) })} placeholder="Minutes per day" />
              <Input value={profile.confidenceLevel} onChange={(event) => setProfile({ ...profile, confidenceLevel: event.target.value as ProfileInput["confidenceLevel"] })} placeholder="beginner / intermediate / advanced" />
              <Textarea value={profile.achievements} onChange={(event) => setProfile({ ...profile, achievements: event.target.value })} placeholder="Existing achievements" />
              <Textarea value={goal.constraints} onChange={(event) => setGoal({ ...goal, constraints: event.target.value })} placeholder="Constraints" />
            </div>
          )}
        </motion.div>
        <div className="fixed inset-x-5 bottom-4 z-50 flex justify-between border border-ember-line bg-surface p-3 md:sticky md:inset-auto md:bottom-0 md:mt-4 md:border-x-0 md:border-b-0 md:px-0 md:py-4">
          <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
              <Glyph name="arrow" size="sm" />
            </Button>
          ) : (
            <Button onClick={generate} disabled={loading}>
              {loading ? "Generating graph..." : "Generate path"}
              <Glyph name="check" size="sm" />
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
