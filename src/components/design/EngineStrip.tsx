import { Glyph, type GlyphName } from "@/components/design/Glyph";

export function EngineStrip({
  items,
}: {
  items: Array<{ label: string; value: string; icon: GlyphName }>;
}) {
  return (
    <div className="grid gap-px border border-ember-line bg-border md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-surface p-4">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sun-orange">
            <Glyph name={item.icon} size="xs" />
            {item.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-ash-muted">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
