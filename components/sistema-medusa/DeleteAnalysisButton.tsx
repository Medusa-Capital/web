"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

interface DeleteAnalysisButtonProps {
  ticker: string;
  onDelete: () => Promise<void>;
}

export function DeleteAnalysisButton({
  ticker,
  onDelete,
}: DeleteAnalysisButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (
      !confirm(
        `¿Eliminar el análisis ${ticker.toUpperCase()}? Todas las versiones publicadas quedarán inactivas y el análisis desaparecerá de la biblioteca. Esta acción no se puede deshacer.`
      )
    )
      return;
    startTransition(async () => {
      await onDelete();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Eliminar análisis ${ticker.toUpperCase()}`}
      className="flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-950/30 px-3 py-1.5 text-[12px] font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-950/50 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden />
      {isPending ? "Eliminando…" : "Eliminar análisis"}
    </button>
  );
}
