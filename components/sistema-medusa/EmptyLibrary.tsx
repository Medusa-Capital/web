import { Library } from "lucide-react";

export function EmptyLibrary() {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-white/[0.06] bg-[#111118] p-10 text-center">
      <Library aria-hidden="true" className="mx-auto mb-4 h-8 w-8 text-zinc-500" />
      <h2 className="text-base font-semibold text-white">
        La biblioteca está vacía
      </h2>
      <p className="mt-2 text-[13px] text-zinc-400">
        Aún no hay análisis publicados bajo el Sistema Medusa.
      </p>
    </div>
  );
}
