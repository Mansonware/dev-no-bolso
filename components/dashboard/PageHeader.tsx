export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <header>
      {eyebrow && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
      )}
      <h1 className="mt-1 text-[26px] sm:text-3xl font-black tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1.5 text-[15px] text-slate-400">{subtitle}</p>}
    </header>
  );
}
