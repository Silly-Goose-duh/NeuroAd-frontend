"use client";

import Link from "next/link";
import { CAMPAIGNS } from "@/lib/fixtures";

export default function HistoryPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Campaign History</h1>
        <p className="mt-2 text-sm text-cream/60">Sample history. NMFM has not scored a real file.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-cream/10">
        {CAMPAIGNS.map((campaign) => (
          <Link
            key={campaign.id}
            href="/dashboard/run"
            className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-cream/10 bg-ink px-4 py-4 last:border-b-0"
          >
            <div>
              <p className="font-medium">{campaign.name}</p>
              <p className="text-xs text-cream/50">
                {campaign.platform} · {campaign.objective} · {campaign.when}
              </p>
            </div>
            <p className="text-2xl font-semibold tabular-nums text-gold">{campaign.score}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
