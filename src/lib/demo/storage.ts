"use client";

import { createInitialState, demoGoal, demoProfile } from "@/lib/demo/graph";
import type { PathfinderState } from "@/types/pathfinder";

const KEY = "ascend_state_v1";
const LEGACY_KEY = "pathfinder_state_v1";

export function loadState(): PathfinderState {
  if (typeof window === "undefined") return createInitialState();
  const raw = window.localStorage.getItem(KEY) ?? window.localStorage.getItem(LEGACY_KEY);
  if (!raw) {
    const state = createInitialState(demoProfile, demoGoal);
    window.localStorage.setItem(KEY, JSON.stringify(state));
    return state;
  }
  try {
    return JSON.parse(raw) as PathfinderState;
  } catch {
    const state = createInitialState();
    window.localStorage.setItem(KEY, JSON.stringify(state));
    return state;
  }
}

export function saveState(state: PathfinderState) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  const state = createInitialState();
  saveState(state);
  return state;
}

export async function loadSecureState(): Promise<PathfinderState> {
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (response.ok) {
      const payload = (await response.json()) as { state: PathfinderState | null };
      if (payload.state) {
        saveState(payload.state);
        return payload.state;
      }
    }
  } catch {
    // Demo fallback below keeps the app usable without Supabase.
  }
  return loadState();
}
