"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Wash = dynamic(() => import("./hero-wash-canvas"), {
  ssr: false,
  loading: () => null,
});

/* prefers-reduced-motion is read from the media query, not useReducedMotion,
   so the canvas never starts a loop and then tries to cancel it after paint. */
export function HeroWash() {
  const [animate, setAnimate] = useState<"on" | "off">("off");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hidden = () => document.visibilityState !== "visible";
    const apply = () => setAnimate(mq.matches || hidden() ? "off" : "on");
    apply();
    mq.addEventListener("change", apply);
    document.addEventListener("visibilitychange", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Wash animate={animate} />
      {/* Scrim keeps cream type above the moving orange. Do not remove. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(17_17_17/0.62),rgb(17_17_17/0.78)_62%,#111111)]" />
    </div>
  );
}
