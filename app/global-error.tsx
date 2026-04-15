"use client";

// Root error boundary — catches errors in the root layout itself.
// Must render its own <html>/<body> because the root layout is gone.

import { useEffect } from "react";
import { captureError } from "@/lib/logger";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    captureError(error, { digest: error.digest, scope: "global" });
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold text-white">
            Error crítico
          </h2>
          <p className="text-sm text-[#B9B8EB]/70">
            Algo salió muy mal. Nuestro equipo ha sido notificado.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4f46e5] transition"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
