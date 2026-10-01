"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Field, LogoLink } from "@/components/ui";
import { FoxMark } from "@/components/fox-mark";
import { getProfile, setSession, type Provider } from "@/lib/session";

const providers: { id: Provider; label: string; email: string }[] = [
  { id: "google", label: "Google", email: "you@company.com" },
  { id: "github", label: "GitHub", email: "you@github.com" },
  { id: "facebook", label: "Facebook", email: "you@facebook.com" },
];

/* Split product screen. On md+ the traced mark is shown once at h-16, and
   LogoLink supplies the word so the dot stays orange ExtraBold. Its small fox
   is hidden at that breakpoint so the mark is not drawn twice. */
function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-[10px] focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <div className="grid min-h-[100dvh] grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1">
        <aside className="flex flex-col justify-center border-b border-line bg-raised px-6 py-6 md:sticky md:top-0 md:h-[100dvh] md:self-start md:border-r md:border-b-0 md:px-12 md:py-8">
          <FoxMark className="hidden h-16 w-16 md:block" />
          <div className="md:mt-5 md:[&_svg]:hidden">
            <LogoLink />
          </div>
          <p className="mt-3 text-sm font-medium leading-snug text-ink-2 md:mt-4 md:max-w-[16ch] md:text-xl">
            Clever | Strategic | Adaptable
          </p>
        </aside>
        <main id="main" tabIndex={-1} className="flex flex-col px-6 py-10 md:px-12 md:py-16">
          <div className="mx-auto my-auto w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("error") === "denied") setNotice("Sign-in was cancelled. Try again.");
    if (query.get("inactive") === "1") {
      setNotice("This account is inactive. Reactivate it, or create a new one.");
    }
  }, []);

  function enter(provider: Provider, providerEmail: string, name: string) {
    const utm = new URLSearchParams(window.location.search).get("utm_source") ?? undefined;
    setSession({ email: providerEmail, name, provider, utm });
    router.push(getProfile() ? "/dashboard" : "/survey");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter your email to continue.");
      return;
    }
    setError("");
    enter("email", email.trim(), email.trim().split("@")[0] || "Member");
  }

  return (
    <AuthFrame>
      <h1 className="text-3xl font-semibold tracking-tighter text-cream">Welcome back</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-2">Sign in to open your workspace.</p>

      {notice ? (
        <p
          role="status"
          className="mt-6 rounded-[16px] border border-line-strong px-4 py-3 text-sm text-gold"
        >
          {notice}
        </p>
      ) : null}

      <fieldset className="mt-8">
        <legend className="sr-only">Sign in with a social account</legend>
        <div className="grid grid-cols-3 gap-2">
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="quiet"
              className="px-3"
              onClick={() => enter(provider.id, provider.email, "Member")}
            >
              {provider.label}
            </Button>
          ))}
        </div>
      </fieldset>

      <div className="my-7 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-4">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form className="grid gap-4" onSubmit={onSubmit} noValidate>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={error ? "Required" : undefined}
        />
        <Button type="submit" className="mt-2 w-full">
          Log in
        </Button>
      </form>

      <p className="mt-7 text-xs leading-relaxed text-ink-4">
        New here?{" "}
        <Link href="/signup" className="text-gold underline underline-offset-4">
          Get started
        </Link>
      </p>
    </AuthFrame>
  );
}
