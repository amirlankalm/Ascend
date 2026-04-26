"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Glyph, type GlyphName } from "@/components/design/Glyph";
import { cn } from "@/lib/utils";

const links: Array<{ href: string; label: string; icon: GlyphName }> = [
  { href: "/dashboard/graph", label: "Graph", icon: "graph" },
  { href: "/dashboard/quest/quest_startup_scan", label: "Quest", icon: "quest" },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: "portfolio" },
  { href: "/dashboard/opportunities", label: "Radar", icon: "radar" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="os-rail pixel-frame mx-auto hidden h-14 items-center gap-1 p-1 md:flex">
      {links.map((link) => {
        const active = pathname.startsWith(link.href.split("/").slice(0, 3).join("/"));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group relative flex h-11 items-center gap-2 px-4 text-sm font-normal lowercase tracking-[-0.02em] transition hover:border-warm-white hover:bg-surface-2 hover:text-warm-white",
              active ? "bg-warm-white text-near-black" : "text-ash-muted",
            )}
          >
            <Glyph name={link.icon} size="sm" />
            {link.label.toLowerCase()}
            <span className={cn("absolute inset-x-4 -bottom-1 h-px bg-warm-white transition", active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
          </Link>
        );
      })}
    </nav>
  );
}
