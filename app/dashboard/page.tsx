"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui";
import { CAMPAIGNS, type Campaign } from "@/lib/fixtures";
import { useSession } from "@/lib/use-session";

const EASE = [0.16, 1, 0.3, 1] as const;

const PLATFORMS = ["All", "Instagram", "YouTube", "Facebook"] as const;
type Platform = (typeof PLATFORMS)[number];

/* Locked fills, measured:
   #1C1C1C on #F59E0B = 7.94:1
   #FFFDE1 on #BE5205 = 4.64:1
   #F59E0B on #BE5205 = 2.22:1, so the orange card never uses gold text.
   The global focus ring is gold. On these fills that ring disappears, so
   each card resets outline-color to a pair that clears 3:1. */

export default function DashboardHome() {
  const { profile } = useSession();
  const reduce = useReducedMotion();
  const workspace = profile?.companyName || "Your workspace";
  const [platform, setPlatform] = useState<Platform>("All");
  const listed =
    platform === "All" ? CAMPAIGNS : CAMPAIGNS.filter((campaign) => campaign.platform === platform);

  return (
    <div className="grid min-w-0 gap-8">
      <style>{`
        .featured-gold :focus-visible { outline-color: #1c1c1c; }
        .featured-orange :focus-visible { outline-color: #fffde1; }
      `}</style>

      <div className="min-w-0">
        <h1 className="break-words text-[26px] font-semibold tracking-tight text-cream">{workspace}</h1>
        <p className="sample-flag mt-2">These figures are not live NMFM output.</p>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <FeaturedCard campaign={CAMPAIGNS[0]} tone="gold" reduce={reduce} delay={0} />
        <FeaturedCard campaign={CAMPAIGNS[1]} tone="orange" reduce={reduce} delay={0.06} />
      </div>

      <motion.section
        data-reveal=""
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        aria-labelledby="campaigns-heading"
      >
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 id="campaigns-heading" className="min-w-0 text-[18px] font-semibold tracking-tight text-cream">
            Based on your campaigns
          </h2>
          <Link href="/dashboard/history" className="shrink-0 text-sm text-ink-2 hover:text-cream">
            View history
          </Link>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Filter by platform" className="flex flex-wrap gap-2">
            {PLATFORMS.map((name) => {
              const on = platform === name;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  aria-controls="campaign-list"
                  onClick={() => setPlatform(name)}
                  className={`inline-flex min-h-11 items-center rounded-[10px] border px-4 text-sm font-semibold transition-colors duration-200 ${
                    on
                      ? "border-[#F59E0B] bg-[#F59E0B] text-[#1C1C1C]"
                      : "border-line-strong bg-transparent text-ink-2 hover:text-cream"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <Link href="/dashboard/history" className="ml-auto shrink-0 text-sm text-ink-2 hover:text-cream">
            All campaigns
          </Link>
          <p className="sr-only" aria-live="polite">
            {platform === "All"
              ? `Showing ${listed.length} campaigns`
              : `Showing ${listed.length} ${platform} campaigns`}
          </p>
        </div>
        <div id="campaign-list" className="overflow-hidden rounded-[16px] border border-line bg-[#1C1C1C]">
          {listed.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-2">No campaigns for this platform.</p>
          ) : (
            listed.map((campaign, index) => (
              <Link
                key={campaign.id}
                href="/dashboard/run"
                className={`flex min-w-0 items-center justify-between gap-4 px-4 py-3.5 transition-colors duration-200 hover:bg-surface ${
                  index > 0 ? "border-t border-line" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream">{campaign.name}</p>
                  <p className="text-xs text-ink-3">
                    {campaign.platform} / {campaign.objective}
                  </p>
                </div>
                <p className="shrink-0 text-xl font-semibold tabular-nums text-[#F59E0B]">
                  <span className="sr-only">Score </span>
                  {campaign.score}
                </p>
              </Link>
            ))
          )}
        </div>
      </motion.section>

      <motion.div
        data-reveal=""
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
        className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {listed.map((campaign) => (
          <Link
            key={campaign.id}
            href="/dashboard/run"
            className="flex min-h-[148px] min-w-0 flex-col justify-between rounded-[16px] border border-[#F59E0B] bg-[#1C1C1C] p-4 transition-[transform,border-color] duration-200 ease-out-expo hover:-translate-y-px active:translate-y-px"
          >
            <p className="text-xs text-ink-3">
              {campaign.platform} / {campaign.objective}
            </p>
            <div className="min-w-0">
              <p className="break-words text-base font-semibold text-[#FFFDE1]">{campaign.name}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[#F59E0B]">
                <span className="sr-only">Score </span>
                {campaign.score}
              </p>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}

function FeaturedCard({
  campaign,
  tone,
  reduce,
  delay,
}: {
  campaign: Campaign;
  tone: "gold" | "orange";
  reduce: boolean | null;
  delay: number;
}) {
  const gold = tone === "gold";
  return (
    <motion.article
      data-reveal=""
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className={`flex min-w-0 items-stretch justify-between gap-4 rounded-[16px] p-5 sm:p-6 ${
        gold ? "featured-gold bg-[#F59E0B] text-[#1C1C1C]" : "featured-orange bg-[#BE5205] text-[#FFFDE1]"
      }`}
    >
      <div className="flex min-w-0 flex-col justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {campaign.platform} / {campaign.objective}
          </p>
          <p className="mt-3 break-words text-[28px] font-semibold leading-tight tracking-tight sm:text-[32px]">
            {campaign.name}
          </p>
        </div>
        <div>
          <ButtonLink
            href="/dashboard/run"
            variant={gold ? "quiet" : "primary"}
            className={
              gold
                ? "!border-transparent !bg-[#1C1C1C] !text-[#FFFDE1] hover:!bg-black"
                : "!border-transparent !bg-[#FFFDE1] !text-[#1C1C1C] hover:!bg-white"
            }
          >
            Run test
          </ButtonLink>
        </div>
      </div>
      <p className="shrink-0 self-center text-[44px] font-semibold leading-none tabular-nums sm:text-[56px]">
        <span className="sr-only">Score </span>
        {campaign.score}
      </p>
    </motion.article>
  );
}
