"use client";

import { useEffect, useState } from "react";
import { InstagramLogo, FacebookLogo, YoutubeLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui";
import { getSocials, setSocials, type SocialState } from "@/lib/session";

/* Icons come from one family, sized from one scale, with a single stroke
   weight. The brand sheet has an "Icon Set" section but ships no glyphs, so
   Phosphor at a consistent 20px is the honest choice. */

const platforms = [
  { id: "instagram", label: "Instagram", Icon: InstagramLogo },
  { id: "facebook", label: "Facebook", Icon: FacebookLogo },
  { id: "youtube", label: "YouTube", Icon: YoutubeLogo },
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
    <div className="flex min-h-full min-w-0 flex-col gap-8">
      <div className="min-w-0">
        <h1 className="break-words text-[26px] font-semibold tracking-tight text-cream">
          Connect Socials
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2">
          Sample toggles for Instagram, Facebook and YouTube. Not required to run an NMFM test.
          Saved on this device only, and not a live connection.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-line bg-raised">
        {platforms.map((platform, index) => {
          const on = socials[platform.id];
          const { Icon } = platform;
          return (
            <article
              key={platform.id}
              className={`flex min-h-16 min-w-0 flex-1 items-center gap-3 px-4 py-4 sm:gap-4 ${
                index > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line bg-sunken">
                <Icon size={20} weight="regular" className={on ? "text-cream" : "text-ink-4"} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-cream">{platform.label}</p>
                <p aria-live="polite" className="text-xs text-ink-2">
                  {on ? "Connected (sample)" : "Not connected"}
                </p>
              </div>
              <Button
                className="shrink-0"
                variant={on ? "quiet" : "primary"}
                onClick={() => toggle(platform.id)}
              >
                {on ? "Disconnect" : "Connect"}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
