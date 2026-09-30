"use client";

import { CAMPAIGNS } from "@/lib/fixtures";

export default function TrendsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Trend analysis and prediction</h1>
        <p className="mt-2 max-w-xl text-sm text-cream/60">
          Prediction uses past NMFM runs. None of these runs are real yet.
        </p>
      </div>
      <div className="rounded-2xl border border-cream/10 bg-ink p-5">
        <p className="text-xs text-cream/45">Sample. This is not a live prediction.</p>
        <div className="mt-6 flex h-56 items-end gap-4">
          {CAMPAIGNS.map((campaign) => (
            <div key={campaign.id} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-44 w-full items-end">
                <div
                  className="w-full rounded-t-2xl bg-orange"
                  style={{ height: `${campaign.score}%`, background: campaign.score > 75 ? "#F59E0B" : "#BE5205" }}
                />
              </div>
              <p className="text-center text-xs text-cream/70">{campaign.name}</p>
              <p className="text-sm font-semibold tabular-nums text-gold">{campaign.score}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
