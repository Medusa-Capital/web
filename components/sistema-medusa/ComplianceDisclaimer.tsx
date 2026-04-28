// Required on every detail page per medusa-capital/CLAUDE.md compliance-first
// principle. Spanish copy is fixed by the plan and must not drift.

export function ComplianceDisclaimer() {
  return (
    <aside
      role="note"
      aria-label="Aviso de cumplimiento"
      className="mt-12 rounded-lg border border-white/[0.06] bg-white/[0.02] p-5 text-[12px] leading-relaxed text-zinc-400"
    >
      Este análisis es contenido educativo y no constituye asesoramiento
      financiero. Haz tu propia investigación antes de tomar decisiones de
      inversión.
    </aside>
  );
}
