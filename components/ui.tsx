"use client";

import Link from "next/link";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { FoxMark } from "./fox-mark";
import { ATTENTION_CURVE, OVERALL, SIGNALS, type Campaign } from "@/lib/fixtures";

/* ---------------------------------------------------------------------------
   Shape Consistency Lock: one radius system, documented rule.
   Interactive controls (buttons, inputs) = 10px (sheet: md)
   Containers and cards = 16px (sheet: lg)
   Pills and chips = full
   No other radius appears anywhere in the app.
   --------------------------------------------------------------------------- */

type Variant = "primary" | "gold" | "quiet" | "danger";

/* Contrast measured, not guessed:
   primary  #FFFDE1 label on #BE5205 = 4.64:1  AA body pass
   gold     #1C1C1C label on #F59E0B = 7.94:1  AA body pass
   quiet    #CFCEB7 label on transparent over #111111 = 11.84:1
   danger   #FFFDE1 label on #8C2F04 = 8.30:1  AA body pass                    */
const buttonStyles: Record<Variant, string> = {
  primary: "bg-brand text-cream hover:bg-[#a84604] active:bg-[#933d03]",
  gold: "bg-gold text-ink hover:bg-[#e0930a] active:bg-[#c87f08]",
  quiet:
    "border border-line-strong bg-transparent text-ink-2 hover:border-cream/45 hover:text-cream active:bg-cream/5",
  danger: "bg-[#8c2f04] text-cream hover:bg-[#a83905] active:bg-[#7d2903]",
};

const buttonBase =
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-5 text-sm font-semibold " +
  "transition-[background-color,border-color,color,transform] duration-200 ease-out-expo " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-55";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: { variant?: Variant; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${buttonBase} ${buttonStyles[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...stringAttrs
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  "data-string"?: string;
  "data-string-id"?: string;
  "data-string-strength"?: string;
  "data-string-radius"?: string;
}) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonStyles[variant]} ${className}`}
      {...stringAttrs}
    >
      {children}
    </Link>
  );
}

/* Horizontal lockup from the brand sheet: orange fox, then "neuro.ad" in
   DM Sans ExtraBold, all #BE5205, including the dot. The sheet draws this
   pair on black. Measured orange on #111111 is 3.96:1, which is the logo,
   not body text. Do not recolor the dot gold and do not set the name in cream. */
export function LogoLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      data-nt=""
      aria-label="neuro.ad"
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <FoxMark className="h-9 w-9 shrink-0" />
      <span className="text-[20px] leading-none font-extrabold tracking-[-0.045em] text-brand">
        neuro.ad
      </span>
    </Link>
  );
}

/* Single CTA intent across the marketing surface: "Get started" for signup,
   "Log in" for login. Never both phrasings for the same action. */
export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-[7px] focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <LogoLink />
      <nav className="flex items-center gap-3">
        <ButtonLink href="/login" variant="quiet">
          Log in
        </ButtonLink>
        <ButtonLink href="/signup" variant="primary">
          Get started
        </ButtonLink>
      </nav>
    </header>
  );
}

const fieldLabel = "block text-xs font-medium text-ink-3";
const fieldControl =
  "w-full rounded-[10px] border border-line-strong bg-sunken px-3 text-sm text-cream " +
  "placeholder:text-ink-4 transition-colors duration-200 ease-out-expo " +
  "hover:border-cream/30 focus:border-gold focus:outline-none focus-visible:outline-2";

export function Field({
  label,
  hint,
  error,
  ...props
}: { label: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className={`${fieldLabel} mb-1.5`}>{label}</span>
      <input
        className={`${fieldControl} h-11 ${error ? "border-[#e5484d]" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${props.name ?? label}-desc` : undefined}
        {...props}
      />
      {/* Error text sits below the input, per the form pattern rules. */}
      {error ? (
        <span className="mt-1.5 block text-xs text-[#ff8f8f]">{error}</span>
      ) : hint ? (
        <span id={`${props.name ?? label}-desc`} className="mt-1.5 block text-xs text-ink-4">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className={`${fieldLabel} mb-1.5`}>{label}</span>
      <textarea
        className={`${fieldControl} min-h-24 resize-y py-2.5`}
        aria-describedby={hint ? `${props.name ?? label}-desc` : undefined}
        {...props}
      />
      {hint ? (
        <span id={`${props.name ?? label}-desc`} className="mt-1.5 block text-xs text-ink-4">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function Pill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors duration-200 ${
        active ? "border-gold bg-gold/10 text-gold" : "border-line text-ink-3"
      }`}
    >
      {children}
    </span>
  );
}

/* Marketing pages must not use filled-track progress bars. This is the
   trackless variant: a bare rule that fills, with the number as the real
   data point. Used only in product surfaces where comparison is the job. */
export function ScoreMeter({ name, value }: { name: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink-2">{name}</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-gold">{value}</span>
      </div>
      <div className="h-px w-full bg-line">
        <div className="h-px bg-gold" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ScoreBoard() {
  return (
    <div className="rounded-[16px] border border-line bg-raised p-5">
      <p className="sample-flag">Sample figures. NMFM is not connected.</p>
      <p className="mt-3 font-mono text-5xl font-semibold tabular-nums text-cream">
        {OVERALL.value}
        <span className="text-lg text-ink-4">/100</span>
      </p>
      <p className="mt-1 text-sm text-gold">{OVERALL.name}</p>
      <div className="mt-7 grid gap-5">
        {SIGNALS.map((signal) => (
          <ScoreMeter key={signal.id} name={signal.name} value={signal.value} />
        ))}
      </div>
    </div>
  );
}

export function CampaignCard({ campaign, index = 0 }: { campaign: Campaign; index?: number }) {
  /* Sonar-tinted depth rather than four loud fills. One brand-coloured card
     leads, the rest recede, so the grid has hierarchy instead of noise. */
  const lead = index === 0;
  return (
    <Link
      href="/dashboard/run"
      className={`group flex min-h-[168px] flex-col justify-between rounded-[16px] border p-4 transition-[transform,border-color] duration-200 ease-out-expo active:translate-y-px ${
        lead
          ? "border-brand/50 bg-brand/10 hover:border-brand"
          : "border-line bg-raised hover:border-line-strong"
      }`}
    >
      <p className="text-xs text-ink-4">
        {campaign.platform} <span className="text-line-strong">/</span> {campaign.when}
      </p>
      <div>
        <p className="text-lg font-semibold text-cream">{campaign.name}</p>
        <p
          className={`mt-1 font-mono text-3xl font-semibold tabular-nums ${
            lead ? "text-gold" : "text-ink-3"
          }`}
        >
          {campaign.score}
        </p>
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
