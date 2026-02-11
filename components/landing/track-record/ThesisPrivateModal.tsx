"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

type ThesisPrivateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ThesisPrivateModal({ isOpen, onClose }: ThesisPrivateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={true}
        className="max-w-[500px] p-0 overflow-hidden border-2"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(27, 26, 100, 0.95), rgba(1, 0, 82, 0.95))",
          borderColor: "rgba(185, 184, 235, 0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Background effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), transparent, rgba(139, 92, 246, 0.1))",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full blur-[100px] pointer-events-none"
          style={{
            background: "rgba(99, 102, 241, 0.2)",
          }}
        />

        {/* Content */}
        <div className="relative p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))",
                borderColor: "rgba(185, 184, 235, 0.3)",
              }}
            >
              <Lock
                className="w-10 h-10"
                style={{
                  color: "#B9B8EB",
                }}
              />
            </div>
          </div>

          <DialogHeader className="text-center space-y-4">
            <DialogTitle
              className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-center"
              style={{
                color: "#ffffff",
              }}
            >
              Tesis privadas
            </DialogTitle>
            <DialogDescription
              className="text-base text-center leading-relaxed"
              style={{
                color: "rgba(204, 204, 224, 0.8)",
              }}
            >
              Las tesis de inversión completas son{" "}
              <span
                className="font-semibold"
                style={{
                  color: "#ffffff",
                }}
              >
                contenido exclusivo
              </span>{" "}
              para los miembros de Medusa Capital.
            </DialogDescription>
          </DialogHeader>

          {/* Additional details */}
          <div
            className="rounded-2xl p-4 border"
            style={{
              background: "rgba(99, 102, 241, 0.1)",
              borderColor: "rgba(185, 184, 235, 0.2)",
            }}
          >
            <p
              className="text-sm text-center leading-relaxed"
              style={{
                color: "rgba(185, 184, 235, 0.7)",
              }}
            >
              Incluyen análisis detallado, contexto de mercado, métricas clave y
              estrategias de entrada/salida validadas.
            </p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onClose}
            variant="secondaryGlow"
            className="w-full rounded-xl px-6 py-4 h-auto text-base font-semibold"
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
