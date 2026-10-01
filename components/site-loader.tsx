"use client";

import { useEffect } from "react";
import { FoxMark } from "@/components/fox-mark";
import { ATTENTION_CURVE } from "@/lib/fixtures";

/* Adapted from Silly-Goose-duh/neuroad SiteLoader. Same timing and skip
   rules. Colors, type, and the fox are the brand lockup, not that site's
   paper theme. The curve is the shared sample, not a live NMFM read. */
export function SiteLoader() {
  useEffect(() => {
    const root = document.documentElement;
    try {
      if (sessionStorage.getItem("neuroad-loader") === "1") {
        root.classList.add("loader-skip");
        return;
      }
    } catch {
      /* private mode */
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("loader-skip");
      return;
    }

    const started = performance.now();
    let finished = false;
    const end = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("neuroad-loader", "1");
      } catch {
        /* ignore */
      }
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const cap = window.setTimeout(end, 2500);
    fontsReady.then(() => {
      const remain = Math.max(0, 900 - (performance.now() - started));
      window.setTimeout(end, remain);
    });

    return () => window.clearTimeout(cap);
  }, []);

  return (
    <div
      id="site-loader"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111111]"
    >
      <div className="flex items-center gap-2.5" data-nt="">
        <FoxMark className="h-9 w-9" />
        <span className="text-[20px] leading-none font-extrabold tracking-[-0.045em] text-brand">
          neuro.ad
        </span>
      </div>
      <div className="mt-8 flex h-16 w-[min(72vw,420px)] items-end gap-px">
        {ATTENTION_CURVE.map((v, i) => (
          <span
            key={i}
            className="loader-bar w-full origin-bottom rounded-t-[4px]"
            style={{
              height: `${12 + v * 88}%`,
              background: v > 0.7 ? "#F59E0B" : "#BE5205",
              animationDelay: `${220 + i * 28}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
