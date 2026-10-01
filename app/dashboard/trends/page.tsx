"use client";

import { CAMPAIGNS } from "@/lib/fixtures";

export default function TrendsPage() {
  return (
    <div className="flex min-h-full min-w-0 flex-col gap-8">
      <div className="min-w-0">
        <h1 className="break-words text-[26px] font-semibold tracking-tight text-cream">
          Trend analysis and prediction
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2">
          Prediction uses past NMFM runs. None of these runs are real yet.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-line bg-raised p-5 sm:p-6">
        <p className="sample-flag">Sample. This is not a live prediction.</p>
        <div className="mt-8 grid min-h-0 flex-1 grid-cols-4 items-stretch gap-2 sm:gap-4">
          {CAMPAIGNS.map((campaign) => (
            <div key={campaign.id} className="flex min-h-0 min-w-0 flex-col gap-2">
              <p className="text-center text-sm font-semibold tabular-nums text-gold">
                {campaign.score}
              </p>
              <div className="flex min-h-40 flex-1 items-end sm:min-h-52">
                <div
                  className="w-full rounded-t-[4px] bg-gold"
                  style={{ height: `${campaign.score}%` }}
                />
              </div>
              <p className="break-words text-center text-xs text-ink-2">{campaign.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
