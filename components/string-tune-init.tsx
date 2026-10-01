"use client";

import { useEffect } from "react";
import StringTune, {
  StringMagnetic,
  StringParallax,
  StringProgress,
} from "@fiddle-digital/string-tune";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/* One shared instance for the app. Landing markup opts in with data-string.
   Dashboard, auth, and the logo do not. Desktop scroll mode defaults to
   "smooth", which calls preventDefault on wheel. The dashboard shell scrolls
   inside a fixed pane, so both modes stay on native "default".
   StringParallax only connects in smooth mode unless the key is parallax[].
   Landing cards use that bracket form so they drift on native scroll. */
export function StringTuneInit() {
  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);

    const boot = () => {
      if (media.matches) return;

      const instance = StringTune.getInstance();
      instance.scrollDesktopMode = "default";
      instance.scrollMobileMode = "default";
      instance.use(StringMagnetic);
      instance.use(StringParallax);
      instance.use(StringProgress);
      instance.start(60);
    };

    boot();
    media.addEventListener("change", boot);
    return () => media.removeEventListener("change", boot);
  }, []);

  return null;
}
