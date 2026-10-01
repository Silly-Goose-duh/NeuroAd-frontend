"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader, ButtonLink, LogoLink } from "@/components/ui";
import { HeroWash } from "@/components/hero-wash";
import { SiteLoader } from "@/components/site-loader";
import { ATTENTION_CURVE, CAMPAIGNS, OVERALL, SIGNALS } from "@/lib/fixtures";
import { brand } from "@/lib/brand";

/* Landing story. Loader and scrubber come from Silly-Goose-duh/neuroad.
   Palette, fox, and wordmark stay on the brand sheet. One shader only.
   StringTune drives the section fills and a slight card drift. It does not
   hijack scroll. Figures are the shared sample, not live NMFM output. */

const MARKERS = [
  { id: "peak", label: "Attention peaks", index: 9, time: "0:07" },
  { id: "drop", label: "Attention drops", index: 17, time: "0:13" },
  { id: "back", label: "Comes back", index: 23, time: "0:18" },
] as const;

const SPENT = [
  { title: "Create", note: "Where neuro.ad works", here: true },
  { title: "Publish", note: "The budget starts here", here: false },
  { title: "Wait", note: "Nothing to read yet", here: false },
  { title: "Read analytics", note: "The money is already gone", here: false },
  { title: "Guess again", note: "The next creative is a hunch", here: false },
] as const;

const MOVES = [
  {
    title: "Answer a short survey",
    body: "Company, product, country, audience. A partial profile is enough to continue.",
    detail: "About 60 seconds",
    frame: "survey" as const,
  },
  {
    title: "Upload a creative",
    body: "Video, image, or copy. The file stays on your device in this build.",
    detail: "MP4, MOV, PNG, JPG",
    frame: "upload" as const,
  },
  {
    title: "Read the seven scores",
    body: "Attention, emotion, memory, intent, audience match, trend alignment, and an overall read.",
    detail: "Sample output",
    frame: "score" as const,
  },
] as const;

function timeAt(index: number) {
  const t = (index / (ATTENTION_CURVE.length - 1)) * 24;
  const s = Math.round(t).toString().padStart(2, "0");
  return `0:${s}`;
}

function Fill({ id }: { id: string }) {
  return (
    <div
      data-string="progress"
      data-string-id={id}
      className="mb-8 h-1 w-full overflow-hidden rounded-[4px] bg-line"
      aria-hidden="true"
    >
      <div className="story-fill h-full bg-gold" />
    </div>
  );
}

function Bars({
  active,
  onPick,
  tall = false,
}: {
  active: number;
  onPick?: (index: number) => void;
  tall?: boolean;
}) {
  return (
    <div
      className={`flex items-end gap-px ${tall ? "h-full min-h-[220px]" : "h-28"}`}
      role={onPick ? "slider" : undefined}
      tabIndex={onPick ? 0 : undefined}
      aria-valuemin={onPick ? 0 : undefined}
      aria-valuemax={onPick ? ATTENTION_CURVE.length - 1 : undefined}
      aria-valuenow={onPick ? active : undefined}
      aria-valuetext={
        onPick ? `Attention ${Math.round(ATTENTION_CURVE[active] * 100)} at ${timeAt(active)}` : undefined
      }
      aria-label={onPick ? "Attention timeline. Use arrow keys to scrub." : undefined}
      onPointerDown={
        onPick
          ? (e) => {
              const el = e.currentTarget;
              el.setPointerCapture(e.pointerId);
              const rect = el.getBoundingClientRect();
              const t = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
              onPick(Math.round(t * (ATTENTION_CURVE.length - 1)));
            }
          : undefined
      }
      onPointerMove={
        onPick
          ? (e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const t = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
              onPick(Math.round(t * (ATTENTION_CURVE.length - 1)));
            }
          : undefined
      }
      onKeyDown={
        onPick
          ? (e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                onPick(Math.min(ATTENTION_CURVE.length - 1, active + 1));
              }
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                onPick(Math.max(0, active - 1));
              }
              if (e.key === "Home") {
                e.preventDefault();
                onPick(0);
              }
              if (e.key === "End") {
                e.preventDefault();
                onPick(ATTENTION_CURVE.length - 1);
              }
            }
          : undefined
      }
    >
      {ATTENTION_CURVE.map((v, i) => (
        <span
          key={i}
          className="w-full rounded-t-[4px]"
          style={{
            height: `${12 + v * 88}%`,
            background: i === active ? "#FFFDE1" : v > 0.7 ? "#F59E0B" : "#BE5205",
          }}
        />
      ))}
    </div>
  );
}

function Frame({ step }: { step: (typeof MOVES)[number]["frame"] }) {
  if (step === "survey") {
    return (
      <dl className="grid gap-4 text-sm">
        {[
          ["Company", "Northwind"],
          ["Product", "Drop"],
          ["Country", "India"],
          ["Audience", "25 to 34"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between border-b border-line pb-3">
            <dt className="text-ink-3">{k}</dt>
            <dd className="font-medium text-cream">{v}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (step === "upload") {
    return (
      <div className="flex min-h-[220px] flex-col justify-center rounded-[10px] border border-dashed border-line-strong px-6">
        <p className="text-lg font-semibold text-cream">Drop a creative here</p>
        <p className="mt-2 text-sm text-ink-2">MP4, MOV, PNG, JPG. It stays on this device.</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-[72px] font-semibold leading-none tabular-nums text-gold">{OVERALL.value}</p>
      <p className="mt-2 text-sm text-cream">{OVERALL.name}</p>
      <ul className="mt-6 grid gap-3">
        {SIGNALS.map((signal) => (
          <li key={signal.id} className="grid grid-cols-[1fr_auto] items-baseline gap-4">
            <span className="text-sm text-ink-2">{signal.name.replace(" Score", "")}</span>
            <span className="text-sm font-semibold tabular-nums text-gold">{signal.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LandingStory() {
  const [index, setIndex] = useState<number>(MARKERS[0].index);
  const [active, setActive] = useState(0);
  const [note, setNote] = useState<"works" | "improve">("works");
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const attention = Math.round(ATTENTION_CURVE[index] * 100);
  const marker = MARKERS.find((m) => m.index === index);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { threshold: 0.55, rootMargin: "-18% 0px -18% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="bg-surface text-ink-2">
      <SiteLoader />
      <div data-string="progress" data-string-id="landing-story">
        <div
          className="scroll-rail pointer-events-none fixed top-0 right-0 z-40 hidden h-[100dvh] w-1 bg-line md:block"
          aria-hidden="true"
        >
          <div className="w-full origin-top bg-gold" style={{ height: "calc(var(--progress, 0) * 100%)" }} />
        </div>
        <section className="relative isolate min-h-[100dvh] overflow-hidden">
          <HeroWash />
          <div className="relative z-10 flex min-h-[100dvh] flex-col">
            <SiteHeader />
            <main id="main" className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pb-8 md:px-10">
              <div className="grid flex-1 items-end gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="max-w-2xl pb-2">
                  <p className="text-sm font-medium text-ink-2">{brand.tagline}</p>
                  <h1 className="mt-4 max-w-[14ch] text-[40px] font-semibold leading-[1.05] tracking-tight text-cream sm:text-5xl md:text-6xl md:leading-[1.02]">
                    Know how the campaign lands before you spend.
                  </h1>
                  <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-ink-2 md:text-lg">
                    NMFM scores six signals, then rolls them into one read on how an ad lands.
                  </p>
                  <div className="mt-8 flex flex-wrap items-end gap-8">
                    <p>
                      <span className="block text-[56px] font-semibold leading-none tabular-nums text-gold">
                        {attention}
                      </span>
                      <span className="mt-1 block text-sm text-cream">Attention now</span>
                    </p>
                    <p>
                      <span className="block text-[56px] font-semibold leading-none tabular-nums text-cream">
                        {OVERALL.value}
                      </span>
                      <span className="mt-1 block text-sm text-ink-2">Overall read</span>
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <ButtonLink
                      href="/signup"
                      data-string="magnetic"
                      data-string-id="hero-get-started"
                      data-string-strength="0.18"
                      data-string-radius="150"
                    >
                      Get started
                    </ButtonLink>
                    <ButtonLink href="/login" variant="quiet">
                      Log in
                    </ButtonLink>
                  </div>
                </div>

                <div className="flex min-h-[280px] flex-col rounded-[16px] border border-line bg-raised p-5 md:min-h-[420px] md:p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm text-cream">{marker ? marker.label : "Attention"}</p>
                    <p className="text-sm tabular-nums text-ink-3">{timeAt(index)}</p>
                  </div>
                  <div className="mt-4 flex-1">
                    <Bars active={index} onPick={setIndex} tall />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {MARKERS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setIndex(m.index)}
                        className={`min-h-11 rounded-[10px] border px-3 text-sm ${
                          index === m.index
                            ? "border-transparent bg-gold text-ink"
                            : "border-line-strong text-ink-2"
                        }`}
                      >
                        {m.time}
                      </button>
                    ))}
                  </div>
                  <p className="sample-flag mt-4">Sample curve. NMFM is not connected.</p>
                </div>
              </div>
            </main>
          </div>
        </section>

        <section className="flex min-h-[100dvh] flex-col justify-center border-t border-line px-6 py-16 md:px-10">
          <div className="mx-auto w-full max-w-[1400px]">
            <Fill id="spent-fill" />
            <div className="grid items-end gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="max-w-[16ch] text-3xl font-semibold leading-tight tracking-tight text-cream md:text-5xl">
                  You find out after the budget is spent.
                </h2>
                <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-ink-2">
                  Analytics report once an ad is live. Most teams publish, wait, and guess. The read should happen at the first step.
                </p>
                <p className="mt-8 text-[64px] font-semibold leading-none tabular-nums text-gold">
                  92
                  <span className="text-ink-3"> to </span>
                  16
                </p>
                <p className="mt-2 text-sm text-cream">Attention in this sample, from 0:07 to 0:13.</p>
                <p className="sample-flag mt-3">Sample figures. NMFM is not connected.</p>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {SPENT.map((step) => (
                  <li
                    key={step.title}
                    className={`rounded-[16px] border px-5 py-5 ${
                      step.here ? "border-transparent bg-[#BE5205] text-cream" : "border-line bg-raised"
                    }`}
                  >
                    <p className="text-xl font-semibold text-cream">{step.title}</p>
                    <p className={`mt-1 text-sm ${step.here ? "text-cream" : "text-ink-2"}`}>{step.note}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="flex min-h-[100dvh] flex-col justify-center border-t border-line bg-raised px-6 py-16 md:px-10">
          <div className="mx-auto w-full max-w-[1400px]">
            <Fill id="signals-fill" />
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-[14ch] text-3xl font-semibold leading-tight tracking-tight text-cream md:text-5xl">
                Six signals, then one read.
              </h2>
              <p>
                <span className="block text-[64px] font-semibold leading-none tabular-nums text-gold">{OVERALL.value}</span>
                <span className="mt-1 block text-sm text-cream">Overall</span>
              </p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SIGNALS.map((signal, i) => {
                const gold = i === 0;
                const orange = i === 1;
                return (
                  <li
                    key={signal.id}
                    className={`flex min-h-[180px] flex-col justify-between rounded-[16px] p-5 ${
                      gold
                        ? "bg-[#F59E0B] text-[#1C1C1C]"
                        : orange
                          ? "bg-[#BE5205] text-[#FFFDE1]"
                          : "border border-line bg-surface"
                    }`}
                  >
                    <p className={`text-sm font-medium ${gold ? "text-[#1C1C1C]" : "text-cream"}`}>
                      {signal.name.replace(" Score", "")}
                    </p>
                    <p
                      className={`text-[56px] font-semibold leading-none tabular-nums ${
                        gold ? "text-[#1C1C1C]" : orange ? "text-[#FFFDE1]" : "text-gold"
                      }`}
                    >
                      {signal.value}
                    </p>
                  </li>
                );
              })}
            </ul>
            <p className="sample-flag mt-5">The same seven figures on every run. Sample data.</p>
          </div>
        </section>

        <section className="border-t border-line px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid w-full max-w-[1400px] gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="max-w-[14ch] text-3xl font-semibold leading-tight tracking-tight text-cream md:text-5xl">
                Three moves, then a score.
              </h2>
              <ol className="mt-10">
                {MOVES.map((step, i) => (
                  <li
                    key={step.title}
                    ref={(el) => {
                      stepRefs.current[i] = el;
                    }}
                    className="border-t border-line py-8"
                  >
                    <p className="text-sm text-ink-3">{i + 1}</p>
                    <h3 className={`mt-2 text-2xl font-semibold ${active === i ? "text-cream" : "text-ink-2"}`}>
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[36ch] text-base leading-relaxed text-ink-2">{step.body}</p>
                    <p className="mt-3 text-xs text-ink-4">{step.detail}</p>
                    <div className="mt-6 rounded-[16px] border border-line bg-raised p-5 lg:hidden">
                      <Frame step={step.frame} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="hidden lg:col-span-7 lg:block">
              <div className="sticky top-8 flex min-h-[70dvh] flex-col justify-between rounded-[16px] border border-line bg-raised p-8">
                <p className="text-sm text-ink-3">{MOVES[active].detail}</p>
                <Frame step={MOVES[active].frame} />
                <p className="sample-flag">Sample frame. NMFM is not connected.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[100dvh] flex-col justify-center border-t border-line bg-raised px-6 py-16 md:px-10">
          <div className="mx-auto w-full max-w-[1400px]">
            <Fill id="report-fill" />
            <h2 className="max-w-[16ch] text-3xl font-semibold leading-tight tracking-tight text-cream md:text-5xl">
              A report you can act on the same day.
            </h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-12">
              <article
                data-string="parallax[]"
                data-string-id="campaign-gold"
                data-string-parallax="0.16"
                className="flex min-h-[280px] flex-col justify-between rounded-[16px] bg-[#F59E0B] p-6 text-[#1C1C1C] lg:col-span-4"
              >
                <p className="text-sm font-medium">
                  {CAMPAIGNS[0].platform} / {CAMPAIGNS[0].objective}
                </p>
                <div>
                  <p className="text-[32px] font-semibold leading-none tracking-tight">{CAMPAIGNS[0].name}</p>
                  <p className="mt-4 text-[64px] font-semibold leading-none tabular-nums">{CAMPAIGNS[0].score}</p>
                </div>
              </article>
              <article
                data-string="parallax[]"
                data-string-id="campaign-orange"
                data-string-parallax="-0.14"
                className="flex min-h-[280px] flex-col justify-between rounded-[16px] bg-[#BE5205] p-6 text-[#FFFDE1] lg:col-span-4"
              >
                <p className="text-sm font-medium">
                  {CAMPAIGNS[1].platform} / {CAMPAIGNS[1].objective}
                </p>
                <div>
                  <p className="text-[32px] font-semibold leading-none tracking-tight">{CAMPAIGNS[1].name}</p>
                  <p className="mt-4 text-[64px] font-semibold leading-none tabular-nums">{CAMPAIGNS[1].score}</p>
                </div>
              </article>
              <div className="flex min-h-[280px] flex-col justify-between rounded-[16px] border border-line bg-surface p-6 lg:col-span-4">
                <p className="text-sm text-ink-2">Attention map</p>
                <Bars active={17} />
                <p className="text-sm text-ink-3">Peaks 0:07. Drops 0:13. Comes back 0:18.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-12">
              <ul className="grid content-center gap-3 rounded-[16px] border border-line bg-surface p-6 lg:col-span-7">
                {SIGNALS.map((signal) => (
                  <li key={signal.id}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-ink-2">{signal.name.replace(" Score", "")}</span>
                      <span className="tabular-nums text-gold">{signal.value}</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-[4px] bg-line">
                      <div className="h-full bg-gold" style={{ width: `${signal.value}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="rounded-[16px] border border-line bg-surface p-6 lg:col-span-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNote("works")}
                    className={`min-h-11 rounded-[10px] px-4 text-sm font-semibold ${
                      note === "works" ? "bg-gold text-ink" : "text-ink-2"
                    }`}
                  >
                    What works
                  </button>
                  <button
                    type="button"
                    onClick={() => setNote("improve")}
                    className={`min-h-11 rounded-[10px] px-4 text-sm font-semibold ${
                      note === "improve" ? "bg-gold text-ink" : "text-ink-2"
                    }`}
                  >
                    To improve
                  </button>
                </div>
                <p className="mt-5 text-base leading-relaxed text-ink-2">
                  {note === "works"
                    ? "The opening holds attention through 0:07, and the return at 0:18 brings viewers back."
                    : "The drop at 0:13 is the weak moment. Shorten it, or move the offer before attention falls."}
                </p>
                <p className="sample-flag mt-5">Illustrative notes. Not output from NMFM.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[100dvh] flex-col justify-between border-t border-line px-6 py-16 md:px-10">
          <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center">
            <p className="text-sm font-medium text-ink-2">{brand.tagline}</p>
            <h2 className="mt-4 max-w-[14ch] text-4xl font-semibold leading-tight tracking-tight text-cream md:text-6xl">
              Find out before you commit the budget.
            </h2>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-2">
              Create an account, answer a short survey, and run your first creative through NMFM.
            </p>
            <div className="mt-8">
              <ButtonLink href="/signup">Get started</ButtonLink>
            </div>
            <p className="mt-6 text-sm text-ink-3">
              NeuroAd estimates likely response. It does not scan anyone&apos;s brain.
            </p>
          </div>
          <footer className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
            <LogoLink />
            <p className="text-sm text-ink-3">{brand.tagline}</p>
            <p className="text-sm text-ink-4">&copy; 2026 neuro.ad</p>
          </footer>
        </section>
      </div>
    </div>
  );
}
