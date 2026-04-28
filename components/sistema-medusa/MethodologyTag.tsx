interface MethodologyTagProps {
  version: string;
}

export function MethodologyTag({ version }: MethodologyTagProps) {
  return (
    <span className="inline-flex items-center rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
      Metodología {version}
    </span>
  );
}
