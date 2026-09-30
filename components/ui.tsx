"use client";

import Link from "next/link";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { FoxMark } from "./fox-mark";
import { ATTENTION_CURVE, OVERALL, SIGNALS, type Campaign } from "@/lib/fixtures";

const buttonStyles = {
  orange: "bg-orange text-cream hover:brightness-110",
  gold: "bg-gold text-ink hover:brightness-105",
  cream: "bg-cream text-ink hover:bg-white",
  ghost: "border border-cream/20 bg-transparent text-cream hover:border-cream/50",
} as const;

type Variant = keyof typeof buttonStyles;

export function Button({
  variant = "orange",
  className = "",
  ...props
}: { variant?: Variant; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition disabled:opacity-50 ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "orange",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function LogoLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 text-cream ${className}`}>
      <FoxMark className="h-8 w-8" />
      <span className="text-lg font-semibold tracking-tight">
        neuro<span className="text-gold">.ad</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
      <LogoLink />
      <nav className="flex items-center gap-3">
        <ButtonLink href="/login" variant="ghost">
          Login
        </ButtonLink>
        <ButtonLink href="/signup" variant="orange">
          Get started
        </ButtonLink>
      </nav>
    </header>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-cream/60">{label}</span>
      <input
        className="h-11 w-full rounded-2xl border border-cream/15 bg-void px-3 text-sm text-cream outline-none placeholder:text-cream/30 focus:border-gold"
        {...props}
      />
    </label>
  );
}

export function TextArea({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-cream/60">{label}</span>
      <textarea
        className="min-h-24 w-full rounded-2xl border border-cream/15 bg-void px-3 py-2 text-sm text-cream outline-none placeholder:text-cream/30 focus:border-gold"
        {...props}
      />
    </label>
  );
}

export function Pill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs ${
        active ? "border-orange bg-orange text-cream" : "border-cream/15 text-cream/70"
      }`}
    >
      {children}
    </span>
  );
}

export function ScoreMeter({ name, value }: { name: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>{name}</span>
        <span className="tabular-nums text-gold">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-cream/10">
        <div className="h-full rounded-full bg-orange" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ScoreBoard() {
  return (
    <div className="rounded-2xl border border-cream/10 bg-ink p-5">
      <p className="text-xs text-cream/50">Sample · NMFM is not connected</p>
      <p className="mt-2 text-5xl font-semibold tabular-nums text-cream">
        {OVERALL.value}
        <span className="text-lg text-cream/50">/100</span>
      </p>
      <p className="mt-1 text-sm text-gold">{OVERALL.name}</p>
      <div className="mt-6 grid gap-4">
        {SIGNALS.map((signal) => (
          <ScoreMeter key={signal.id} name={signal.name} value={signal.value} />
        ))}
      </div>
    </div>
  );
}

const tones = ["bg-orange text-cream", "bg-gold text-ink", "bg-cream text-ink", "bg-[#3a2208] text-cream"];

export function CampaignCard({ campaign, index = 0 }: { campaign: Campaign; index?: number }) {
  return (
    <Link
      href="/dashboard/run"
      className={`${tones[index % tones.length]} flex min-h-[168px] flex-col justify-between rounded-2xl p-4 transition hover:-translate-y-0.5`}
    >
      <p className="text-xs opacity-70">
        {campaign.platform} · {campaign.when}
      </p>
      <div>
        <p className="text-lg font-semibold">{campaign.name}</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">{campaign.score}</p>
      </div>
    </Link>
  );
}

export function AttentionBars({ progress = 1 }: { progress?: number }) {
  const visible = Math.max(1, Math.round(ATTENTION_CURVE.length * progress));
  return (
    <div className="flex h-8 items-end gap-px" aria-hidden="true">
      {ATTENTION_CURVE.map((value, index) => (
        <span
          key={index}
          className="w-full rounded-[1px]"
          style={{
            height: `${18 + value * 82}%`,
            background:
              index < visible ? (value > 0.7 ? "#F59E0B" : "#BE5205") : "rgba(255,253,225,0.15)",
          }}
        />
      ))}
    </div>
  );
}
