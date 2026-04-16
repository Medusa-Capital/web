// Featurebase-style top navigation header for the member feedback area.
// Server component — rendered in the ideas layout.

import Image from "next/image";
import Link from "next/link";

interface IdeasHeaderProps {
  userName: string;
}

export function IdeasHeader({ userName }: IdeasHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo + brand */}
        <Link
          href="/ideas"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/img/icons/logo-icon.svg"
            alt=""
            width={20}
            height={22}
            className="opacity-90"
          />
          <span className="text-sm font-semibold text-white tracking-tight">
            Medusa Capital
          </span>
        </Link>

        {/* Center: Nav tabs */}
        <nav
          className="hidden sm:flex items-center gap-0.5"
          aria-label="Secciones"
        >
          <Link
            href="/ideas"
            className="rounded-md bg-white/[0.08] px-3 py-1.5 text-[13px] font-medium text-white transition-colors"
          >
            Feedback
          </Link>
          <span
            className="rounded-md px-3 py-1.5 text-[13px] text-[#525258] cursor-default select-none"
            title="Próximamente"
          >
            Roadmap
          </span>
          <span
            className="rounded-md px-3 py-1.5 text-[13px] text-[#525258] cursor-default select-none"
            title="Próximamente"
          >
            Novedades
          </span>
        </nav>

        {/* Right: User + actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden sm:block text-[13px] text-[#71717a] hover:text-[#a1a1aa] transition-colors"
          >
            Ir al sitio
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6366f1]/20 text-[11px] font-semibold text-[#6366f1]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-[13px] text-[#a1a1aa] max-w-[120px] truncate">
              {userName}
            </span>
            <form action="/api/auth/whop/logout" method="POST">
              <button
                type="submit"
                className="text-[12px] text-[#525258] hover:text-[#a1a1aa] transition-colors"
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
