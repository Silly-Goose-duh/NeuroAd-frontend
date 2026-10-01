"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Field, LogoLink } from "@/components/ui";
import { FoxMark } from "@/components/fox-mark";
import { setSession, type Provider } from "@/lib/session";

/* One grouped fieldset, one primary path. Social controls stay quiet so they
   do not share weight with the email submit. */

const providers: { id: Provider; label: string; email: string }[] = [
  { id: "google", label: "Google", email: "you@company.com" },
  { id: "github", label: "GitHub", email: "you@github.com" },
  { id: "facebook", label: "Facebook", email: "you@facebook.com" },
];

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

export default function SignupPage() {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("error") === "denied") setNotice("Sign-in was cancelled. Try again.");
    if (query.get("inactive") === "1") {
      setNotice("This account is inactive. Reactivate it, or create a new one.");
    }
  }, []);

  function continueWith(provider: Provider, providerEmail: string, displayName: string) {
    const utm = new URLSearchParams(window.location.search).get("utm_source") ?? undefined;
    setSession({ email: providerEmail, name: displayName, provider, utm });
    router.push("/survey");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Enter your name and email to continue.");
      return;
    }
    setError("");
    continueWith("email", email.trim(), name.trim());
  }

  return (
    <AuthFrame>
      <h1 className="text-3xl font-semibold tracking-tighter text-cream">Create your account</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-2">
        Company details come next. A partial profile is enough to reach the dashboard.
      </p>

      {notice ? (
        <p
          role="status"
          className="mt-6 rounded-[16px] border border-line-strong px-4 py-3 text-sm text-gold"
        >
          {notice}
        </p>
      ) : null}

      <fieldset className="mt-8">
        <legend className="sr-only">Sign up with a social account</legend>
        <div className="grid grid-cols-3 gap-2">
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="quiet"
              className="px-3"
              onClick={() => continueWith(provider.id, provider.email, "New user")}
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
          label="Name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={error && !name.trim() ? "Required" : undefined}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={error && !email.trim() ? "Required" : undefined}
        />
        {error && name.trim() && email.trim() ? (
          <p role="alert" className="text-sm text-[#ff8f8f]">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="mt-2 w-full">
          Continue with email
        </Button>
      </form>

      <p className="mt-7 text-xs leading-relaxed text-ink-4">
        By continuing you agree to the Terms and Privacy. Already a member?{" "}
        <Link href="/login" className="text-gold underline underline-offset-4">
          Log in
        </Link>
      </p>
    </AuthFrame>
  );
}
