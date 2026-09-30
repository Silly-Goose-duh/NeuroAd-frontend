"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Field, LogoLink } from "@/components/ui";
import { NeuralBackdrop } from "@/components/neural-backdrop";
import { setSession, type Provider } from "@/lib/session";

const providers: { id: Provider; label: string; email: string }[] = [
  { id: "google", label: "Continue with Google", email: "you@company.com" },
  { id: "github", label: "Continue with GitHub", email: "you@github.com" },
  { id: "facebook", label: "Continue with Facebook", email: "you@facebook.com" },
];

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
      setNotice("This account is inactive. Reactivate, or create a new one.");
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
      setError("Name and email are required.");
      return;
    }
    setError("");
    continueWith("email", email.trim(), name.trim());
  }

  return (
    <div className="grid min-h-screen bg-void md:grid-cols-2">
      <div className="flex flex-col px-6 py-8 md:px-12">
        <LogoLink />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-semibold tracking-tight">Create your neuro.ad account.</h1>
          <p className="mt-3 text-cream/65">
            Basic company details come next. A partial profile is enough to reach the dashboard.
          </p>
          {notice ? <p className="mt-4 text-sm text-gold">{notice}</p> : null}
          <div className="mt-8 grid gap-3">
            {providers.map((provider) => (
              <Button
                key={provider.id}
                variant="ghost"
                className="w-full"
                onClick={() => continueWith(provider.id, provider.email, "New user")}
              >
                {provider.label}
              </Button>
            ))}
          </div>
          <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
            <Field label="Name" value={name} onChange={(event) => setName(event.target.value)} />
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {error ? <p className="text-sm text-orange">{error}</p> : null}
            <Button type="submit" className="w-full">
              Continue with email
            </Button>
          </form>
          <p className="mt-6 text-xs text-cream/45">
            By continuing you agree to Terms and Privacy. Already a member?{" "}
            <Link href="/login" className="text-gold">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="relative hidden min-h-screen md:block">
        <NeuralBackdrop />
      </div>
    </div>
  );
}
