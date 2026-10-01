"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoLink } from "@/components/ui";
import { clearSession } from "@/lib/session";
import { useSession } from "@/lib/use-session";

/* Narrow sidebar, quiet nav, cream active item, log out at the bottom,
   scrolling canvas, slim sample bar in the main column only.
   Sidebar stays 232px so the long label wraps instead of widening the page.
   Active nav is cream on #1C1C1C (16.55:1). Muted nav is ink-3 (7.27:1).
   Orange is the lockup only (3.57:1 on raised) and is not used as nav text.
   Gold score on raised is 7.94:1. The bottom bar is a sample, not playback. */

const links: { href: string; label: string; wide?: boolean }[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/run", label: "Test Campaigns using NMFM", wide: true },
  { href: "/dashboard/socials", label: "Connect Socials" },
  { href: "/dashboard/trends", label: "Trend analysis" },
  { href: "/dashboard/history", label: "Campaign History" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/settings", label: "Settings" },
];

function ShellSkeleton() {
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-surface">
      <div className="hidden w-[232px] min-w-[232px] max-w-[232px] shrink-0 flex-col bg-raised px-4 pt-7 md:flex">
        <div className="h-9 w-32 animate-pulse rounded-[10px] bg-surface" />
        <div className="mt-10 grid gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 animate-pulse rounded-[10px] bg-surface" />
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 p-4 md:p-6">
          <div className="h-8 w-64 max-w-full animate-pulse rounded-[10px] bg-raised" />
          <div className="mt-6 h-56 animate-pulse rounded-[16px] bg-raised" />
        </div>
        <div className="px-4 pb-4 md:px-6">
          <div className="h-14 animate-pulse rounded-[16px] bg-raised" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready } = useSession();

  useEffect(() => {
    if (ready && !session) router.replace("/signup");
  }, [ready, session, router]);

  if (!ready || !session) return <ShellSkeleton />;

  function active(href: string) {
    return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  }

  function logOut() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-surface text-ink-2">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[10px] focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <aside className="hidden h-full min-h-0 w-[232px] min-w-[232px] max-w-[232px] shrink-0 flex-col overflow-hidden bg-raised px-4 pt-7 pb-6 md:flex">
        <LogoLink className="px-2" />
        <nav aria-label="Dashboard" className="mt-10 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {links.map((link) => {
            const on = active(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={on ? "page" : undefined}
                className={`block min-w-0 rounded-[10px] px-2 py-2 text-sm leading-snug break-words transition-colors duration-200 ${
                  on ? "font-medium text-cream" : "text-ink-3 hover:text-cream"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="mt-2 shrink-0 rounded-[10px] px-2 py-2 text-left text-sm text-ink-3 transition-colors duration-200 hover:text-cream"
          onClick={logOut}
        >
          Log out
        </button>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="shrink-0 overflow-x-hidden border-b border-line bg-raised px-4 py-4 md:hidden">
          <LogoLink />
          <nav aria-label="Dashboard" className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
            {links.map((link) => {
              const on = active(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={on ? "page" : undefined}
                  className={`min-w-0 break-words py-2 text-sm leading-snug transition-colors duration-200 ${
                    link.wide ? "col-span-2" : ""
                  } ${on ? "font-medium text-cream" : "text-ink-3 hover:text-cream"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="mt-1 py-2 text-left text-sm text-ink-3 transition-colors duration-200 hover:text-cream"
            onClick={logOut}
          >
            Log out
          </button>
        </div>

        <main
          id="main"
          tabIndex={-1}
          className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-5 focus-visible:outline-none md:px-6 md:py-6"
        >
          {children}
        </main>

        <div className="shrink-0 px-4 pb-4 md:px-6 md:pb-5">
          <div
            className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 rounded-[16px] border border-line bg-raised px-3 py-2.5 md:flex-nowrap md:gap-4 md:px-4"
            role="region"
            aria-label="Sample campaign"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-cream">Monsoon Drop</p>
              <p className="text-xs text-ink-3">Sample</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-ink-3" aria-hidden="true">
                Attention
              </span>
              <div
                className="h-1.5 w-24 overflow-hidden rounded-[4px] bg-line-strong"
                role="meter"
                aria-label="Attention"
                aria-valuenow={82}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full w-[82%] rounded-[4px] bg-gold" />
              </div>
            </div>
            <p className="shrink-0 text-lg font-semibold tabular-nums text-gold">
              <span className="sr-only">Score </span>
              82
            </p>
            <Link
              href="/dashboard/run"
              className="inline-flex min-h-11 shrink-0 items-center rounded-[10px] px-1 text-sm text-ink-2 underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-cream hover:decoration-cream"
            >
              Open test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
