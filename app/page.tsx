"use client";

import { motion } from "framer-motion";
import { SiteHeader, ButtonLink, Pill } from "@/components/ui";
import { NeuralBackdrop } from "@/components/neural-backdrop";
import { OVERALL, SIGNALS } from "@/lib/fixtures";
import { brand } from "@/lib/brand";

const steps = [
  {
    n: "01",
    title: "Survey",
    body: "Basic company details. A partial profile is enough to enter the dashboard.",
  },
  {
    n: "02",
    title: "Dashboard",
    body: "Your workspace. Connect socials is a side item, not the path to a score.",
  },
  {
    n: "03",
    title: "Test with NMFM",
    body: "The only action that produces the seven-score campaign report.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-void text-cream">
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <NeuralBackdrop />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/25" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex flex-1 flex-col justify-center px-6 pb-16 md:px-10">
            <p className="text-sm tracking-wide text-gold">neuro.ad</p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mt-4 max-w-[12ch] text-5xl font-semibold tracking-tight md:text-7xl"
            >
              Know how the campaign lands before you spend.
            </motion.h1>
            <p className="mt-6 max-w-xl text-base text-cream/70 md:text-lg">
              NMFM scores attention, emotion, memory, purchase intent, audience match and trend
              alignment, then an overall neuromarketing score.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/signup">Get started</ButtonLink>
              <ButtonLink href="/login" variant="ghost">
                Login
              </ButtonLink>
            </div>
            <div className="mt-10 flex max-w-3xl flex-wrap gap-2">
              {SIGNALS.map((signal) => (
                <Pill key={signal.id}>{signal.name.replace(" Score", "")}</Pill>
              ))}
              <Pill active>Overall</Pill>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10">
        <h2 className="text-2xl font-semibold md:text-3xl">From a company profile to a score.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.n} className="rounded-2xl border border-cream/10 bg-ink p-5">
              <p className="text-xs text-gold">{step.n}</p>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-cream/70">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold md:text-3xl">The report.</h2>
          <p className="text-xs text-cream/45">Sample figures. NMFM is not connected.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl bg-orange p-6 text-cream">
            <p className="text-6xl font-semibold tabular-nums">{OVERALL.value}</p>
            <p className="mt-3 text-sm">{OVERALL.name}</p>
          </article>
          {SIGNALS.map((signal) => (
            <article key={signal.id} className="rounded-2xl border border-cream/10 bg-ink p-5">
              <p className="text-3xl font-semibold tabular-nums text-gold">{signal.value}</p>
              <p className="mt-2 text-cream/75">{signal.name}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-xl text-sm text-cream/50">
          NeuroAd estimates likely response. It does not scan anyone&apos;s brain.
        </p>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 px-6 py-8 md:px-10">
        <p className="text-sm text-gold">{brand.tagline}</p>
        <p className="text-sm text-cream/40">© 2026 neuro.ad</p>
      </footer>
    </div>
  );
}
