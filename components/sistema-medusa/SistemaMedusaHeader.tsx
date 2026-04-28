// Sticky top navigation for /sistema-medusa. Mirrors IdeasHeader structure
// so members get a consistent member-only chrome across surfaces.

import Image from "next/image";
import Link from "next/link";

interface SistemaMedusaHeaderProps {
  userName: string;
}

export function SistemaMedusaHeader({ userName }: SistemaMedusaHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/sistema-medusa"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/img/icons/logo-icon.svg"
            alt=""
            width={20}
            height={22}
            className="opacity-90"
          />
          <span className="text-sm font-semibold tracking-tight text-white">
            Medusa Capital
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 sm:flex"
          aria-label="Secciones"
        >
          <Link
            href="/sistema-medusa"
            className="rounded-md bg-white/[0.08] px-3 py-1.5 text-[13px] font-medium text-white transition-colors"
          >
            Sistema Medusa
          </Link>
          <Link
            href="/ideas"
            className="rounded-md px-3 py-1.5 text-[13px] text-[#a1a1aa] transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            Feedback
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden text-[13px] text-[#71717a] transition-colors hover:text-[#a1a1aa] sm:block"
          >
            Ir al sitio
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6366f1]/20 text-[11px] font-semibold text-[#6366f1]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden max-w-[120px] truncate text-[13px] text-[#a1a1aa] md:block">
              {userName}
            </span>
            <form action="/api/auth/whop/logout" method="POST">
              <button
                type="submit"
                className="text-[12px] text-[#525258] transition-colors hover:text-[#a1a1aa]"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
