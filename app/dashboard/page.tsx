"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ButtonLink, CampaignCard, Pill } from "@/components/ui";
import { NeuralBackdrop } from "@/components/neural-backdrop";
import { CAMPAIGNS, OVERALL } from "@/lib/fixtures";
import { useSession } from "@/lib/use-session";

export default function DashboardHome() {
  const { profile } = useSession();
  const workspace = profile?.companyName || "Your workspace";

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs text-cream/50">For you</p>
        <h1 className="mt-1 text-2xl font-semibold">{workspace}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-h-[220px] overflow-hidden rounded-2xl bg-orange p-6 text-cream"
        >
          <div className="pointer-events-none absolute top-4 right-4 h-28 w-28 overflow-hidden rounded-2xl opacity-80">
            <NeuralBackdrop />
          </div>
          <p className="text-xs">Test Campaigns using NMFM</p>
          <h2 className="mt-3 max-w-[16ch] text-3xl font-semibold tracking-tight">
            Run a campaign before you spend.
          </h2>
          <div className="mt-6">
            <ButtonLink href="/dashboard/run" variant="cream">
              Run NMFM
            </ButtonLink>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="min-h-[220px] rounded-2xl bg-gold p-6 text-ink"
        >
          <p className="text-xs">Latest read · Sample</p>
          <p className="mt-4 text-6xl font-semibold tabular-nums">{OVERALL.value}</p>
          <p className="mt-2 max-w-[18ch] text-sm font-medium">{OVERALL.name}</p>
        </motion.article>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Based on your campaigns</h2>
          <Link href="/dashboard/history" className="text-xs text-cream/50">
            View history
          </Link>
        </div>
        <div className="grid gap-2">
          {CAMPAIGNS.slice(0, 2).map((campaign) => (
            <Link
              key={campaign.id}
              href="/dashboard/run"
              className="flex items-center justify-between rounded-2xl bg-ink px-4 py-3"
            >
              <div>
                <p className="font-medium">{campaign.name}</p>
                <p className="text-xs text-cream/50">
                  {campaign.platform} · {campaign.when}
                </p>
              </div>
              <p className="text-xl font-semibold tabular-nums text-gold">{campaign.score}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Pill active>Instagram</Pill>
        <Pill>YouTube</Pill>
        <Pill>Facebook</Pill>
        <Pill>X</Pill>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CAMPAIGNS.map((campaign, index) => (
          <CampaignCard key={campaign.id} campaign={campaign} index={index} />
        ))}
      </div>
    </div>
  );
}
