"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Field, LogoLink } from "@/components/ui";
import { NeuralBackdrop } from "@/components/neural-backdrop";
import { getProfile, setSession, type Provider } from "@/lib/session";

const providers: { id: Provider; label: string; email: string }[] = [
  { id: "google", label: "Continue with Google", email: "you@company.com" },
  { id: "github", label: "Continue with GitHub", email: "you@github.com" },
  { id: "facebook", label: "Continue with Facebook", email: "you@facebook.com" },
];

export default function LoginPage() {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("error") === "denied") setNotice("Sign-in was cancelled. Try again.");
    if (query.get("inactive") === "1") {
      setNotice("This account is inactive. Reactivate, or create a new one.");
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
      setError("Email is required.");
      return;
    }
    setError("");
    enter("email", email.trim(), email.trim().split("@")[0] || "Member");
  }

  return (
    <div className="grid min-h-screen bg-void md:grid-cols-2">
      <div className="flex flex-col px-6 py-8 md:px-12">
        <LogoLink />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back.</h1>
          <p className="mt-3 text-cream/65">Sign in to open your workspace.</p>
          {notice ? <p className="mt-4 text-sm text-gold">{notice}</p> : null}
          <div className="mt-8 grid gap-3">
            {providers.map((provider) => (
              <Button
                key={provider.id}
                variant="ghost"
                className="w-full"
                onClick={() => enter(provider.id, provider.email, "Member")}
              >
                {provider.label}
              </Button>
            ))}
          </div>
          <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {error ? <p className="text-sm text-orange">{error}</p> : null}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <p className="mt-6 text-xs text-cream/45">
            New here?{" "}
            <Link href="/signup" className="text-gold">
              Get started
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
