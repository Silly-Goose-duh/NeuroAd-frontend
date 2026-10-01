"use client";

import Link from "next/link";
import { CAMPAIGNS } from "@/lib/fixtures";

/* Four items, so this stays a row list. A hairline between rows is scannable
   here; separate cards would add chrome without adding information. */

export default function HistoryPage() {
  return (
    <div className="flex min-h-full min-w-0 flex-col gap-8">
      <div className="min-w-0">
        <h1 className="break-words text-[26px] font-semibold tracking-tight text-cream">
          Campaign History
        </h1>
        <p className="sample-flag mt-2">Sample history. NMFM has not scored a real file.</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-line bg-raised">
        {CAMPAIGNS.map((campaign, index) => (
          <Link
            key={campaign.id}
            href="/dashboard/run"
            className={`flex min-h-16 min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 ${
              index > 0 ? "border-t border-line" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-cream">{campaign.name}</p>
              <p className="truncate text-xs text-ink-3">
                {campaign.platform} / {campaign.objective} / {campaign.when}
              </p>
            </div>
            <p className="shrink-0 text-xl font-semibold tabular-nums text-gold">{campaign.score}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
