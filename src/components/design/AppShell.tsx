import Link from "next/link";
import { AppNav } from "@/components/design/AppNav";
import { Glyph } from "@/components/design/Glyph";
import { Mountains } from "./Mountains";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="night-map graph-grid relative min-h-screen overflow-hidden text-warm-white">
      <Mountains subtle />
      <div className="pixel-overlay opacity-20 mix-blend-screen" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 bg-[linear-gradient(180deg,rgba(255,247,234,0.08),transparent)]" />
      <header className="relative z-20 grid min-h-24 grid-cols-[1fr_auto] items-center gap-4 px-5 md:grid-cols-[260px_1fr_auto] md:px-8">
        <Link href="/dashboard/graph" className="os-rail pixel-frame flex h-14 items-center gap-3 px-3">
          <div className="grid h-9 w-9 place-items-center border border-sun-orange/50 bg-hot-orange/20 text-sun-orange">
            <Glyph name="ascend" size="md" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none">Ascend</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ash-muted">Career OS</p>
          </div>
        </Link>
        <AppNav />
        <div className="flex items-center justify-end gap-2">
          <div className="os-rail pixel-frame hidden h-14 items-center gap-3 px-4 lg:flex">
            <Glyph name="command" size="sm" className="text-sun-orange" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash-muted">Search</span>
            <kbd className="rounded-md border border-ember-line px-1.5 py-0.5 font-mono text-[10px] text-warm-white">K</kbd>
          </div>
          <div className="os-rail pixel-frame grid h-14 w-14 place-items-center">
            <Glyph name="bell" size="sm" className="text-sun-orange" />
          </div>
          <div className="os-rail pixel-frame flex h-14 items-center gap-2 px-4 font-mono text-xs text-sun-orange">
            <Glyph name="bolt" size="sm" />
            XP 000
          </div>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </main>
  );
}
