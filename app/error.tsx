"use client";

// Segment error boundary — catches errors in the current route segment.
// Displayed instead of the broken segment; the root layout (nav, etc.) stays.

import { useEffect } from "react";
import { captureError } from "@/lib/logger";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SegmentError({ error, reset }: Props) {
  useEffect(() => {
    captureError(error, { digest: error.digest });
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold text-white">
          Algo salió mal
        </h2>
        <p className="text-sm text-[#B9B8EB]/70">
          Ocurrió un error inesperado. Por favor, inténtalo de nuevo.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4f46e5] transition"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
