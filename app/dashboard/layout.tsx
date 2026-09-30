"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FlaskConical,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Share2,
  TrendingUp,
  User,
} from "lucide-react";
import { AttentionBars, ButtonLink, LogoLink } from "@/components/ui";
import { FoxMark } from "@/components/fox-mark";
import { clearSession } from "@/lib/session";
import { useSession } from "@/lib/use-session";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/run", label: "Test Campaigns using NMFM", icon: FlaskConical, primary: true },
  { href: "/dashboard/socials", label: "Connect Socials", icon: Share2 },
  { href: "/dashboard/trends", label: "Trend analysis", icon: TrendingUp },
  { href: "/dashboard/history", label: "Campaign History", icon: History },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready } = useSession();

  useEffect(() => {
    if (ready && !session) router.replace("/signup");
  }, [ready, session, router]);

  if (!ready || !session) return <div className="min-h-screen bg-void" />;

  function active(href: string) {
    return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  }

  return (
    <div className="flex min-h-screen bg-void text-cream">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-cream/10 bg-ink px-4 py-5 md:flex">
        <LogoLink />
        <nav className="mt-8 grid gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const on = active(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm ${
                  on ? "bg-cream/5 text-cream" : "text-cream/70 hover:text-cream"
                } ${link.primary ? "font-semibold text-orange" : ""}`}
              >
                <Icon size={16} />
                <span className="leading-tight">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-cream/60 hover:text-cream"
          onClick={() => {
            clearSession();
            router.push("/login");
          }}
        >
          <LogOut size={16} />
          Log out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-cream/10 px-4 py-3 md:hidden">
          <LogoLink />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                  active(link.href) ? "border-orange text-orange" : "border-cream/15 text-cream/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
        <div className="flex items-center gap-4 border-t border-cream/10 bg-ink px-4 py-3 md:px-6">
          <FoxMark className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Monsoon Drop</p>
            <p className="text-xs text-cream/50">Sample NMFM run</p>
          </div>
          <div className="hidden min-w-0 flex-1 sm:block">
            <AttentionBars />
          </div>
          <p className="text-2xl font-semibold tabular-nums text-gold">82</p>
          <ButtonLink href="/dashboard/run" variant="cream" className="shrink-0">
            Open test
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
