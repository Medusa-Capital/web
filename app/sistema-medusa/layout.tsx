// /sistema-medusa layout — single requireMember() (no double-read in pages).
// Auth gate redirects to /login?returnTo=… on failure; sanitizeReturnTo
// preserves ?v=\d{1,4} for detail-page deep links.

import { headers } from "next/headers";
import { requireMember } from "@/lib/auth/require";
import { SistemaMedusaHeader } from "@/components/sistema-medusa/SistemaMedusaHeader";

export default async function SistemaMedusaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/sistema-medusa";
  const session = await requireMember({ returnTo: pathname });
  const userName = session.displayName ?? session.email ?? "Miembro";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <SistemaMedusaHeader userName={userName} />
      {children}
    </div>
  );
}
