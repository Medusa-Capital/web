// /login — Login page
// Shows "Entrar con Whop" button + contextual copy based on ?error= param.
// Error copy keys:
//   canceled  → "Cancelaste el acceso"
//   retry     → "Hubo un problema. Intenta de nuevo."
//   no-email  → "Necesitamos tu email. Añádelo en Whop."

import { Suspense } from "react";
import { LoginContent } from "./login-content";

export const metadata = {
  title: "Login — Medusa Capital",
  description: "Accede con tu cuenta de Whop para entrar en Medusa Capital.",
  robots: "noindex",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
