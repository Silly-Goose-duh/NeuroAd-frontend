"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { getSocials, setSocials, type SocialState } from "@/lib/session";

const platforms = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "youtube", label: "YouTube" },
] as const;

export default function SocialsPage() {
  const [socials, setLocal] = useState<SocialState>({
    instagram: false,
    facebook: false,
    youtube: false,
  });

  useEffect(() => {
    setLocal(getSocials());
  }, []);

  function toggle(id: keyof SocialState) {
    const next = { ...socials, [id]: !socials[id] };
    setLocal(next);
    setSocials(next);
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Connect Socials</h1>
        <p className="mt-2 max-w-xl text-sm text-cream/60">
          Realtime updates of connected socials. Not required to run an NMFM test. Saved on this
          device only. Realtime updates are not live.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {platforms.map((platform) => {
          const on = socials[platform.id];
          return (
            <article key={platform.id} className="rounded-2xl border border-cream/10 bg-ink p-5">
              <p className="text-lg font-semibold">{platform.label}</p>
              <p className="mt-2 text-sm text-cream/55">{on ? "Connected (sample)" : "Not connected"}</p>
              <Button className="mt-6" variant={on ? "ghost" : "orange"} onClick={() => toggle(platform.id)}>
                {on ? "Disconnect" : "Connect"}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
