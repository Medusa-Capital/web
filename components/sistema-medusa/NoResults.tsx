import Link from "next/link";
import { SearchX } from "lucide-react";

export function NoResults() {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-white/[0.06] bg-[#111118] p-10 text-center">
      <SearchX aria-hidden="true" className="mx-auto mb-4 h-8 w-8 text-zinc-500" />
      <h2 className="text-base font-semibold text-white">
        Sin resultados con esos filtros
      </h2>
      <p className="mt-2 text-[13px] text-zinc-400">
        Prueba a quitar filtros o cambiar la búsqueda.
      </p>
      <Link
        href="/sistema-medusa"
        className="mt-4 inline-flex rounded-md bg-[#6366f1]/15 px-3 py-1.5 text-[12px] font-medium text-[#6366f1] transition-colors hover:bg-[#6366f1]/25"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}
