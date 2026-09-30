"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, LogoLink, TextArea } from "@/components/ui";
import { getProfile, getSession, setProfile } from "@/lib/session";

export default function SurveyPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [country, setCountry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/signup");
      return;
    }
    setEmail(session.email);
    const profile = getProfile();
    if (profile) {
      setCompanyName(profile.companyName);
      setProductName(profile.productName);
      setCompanyDescription(profile.companyDescription);
      setCountry(profile.country);
      setTargetAudience(profile.targetAudience);
    }
    setReady(true);
  }, [router]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!companyName.trim() || !productName.trim() || !country.trim() || !targetAudience.trim()) {
      setError("Company, product, country, and audience are required.");
      return;
    }
    setProfile({
      email,
      companyName: companyName.trim(),
      productName: productName.trim(),
      companyDescription: companyDescription.trim(),
      country: country.trim(),
      targetAudience: targetAudience.trim(),
      status: companyDescription.trim() ? "complete" : "partial",
    });
    router.push("/dashboard");
  }

  if (!ready) return <main className="min-h-screen bg-void" />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-void px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg rounded-2xl border border-cream/10 bg-ink p-6 md:p-8"
      >
        <LogoLink />
        <p className="mt-6 text-xs text-cream/50">{email}</p>
        <h1 className="mt-2 text-2xl font-semibold">Basic company details</h1>
        <p className="mt-2 text-sm text-cream/65">
          This is how NMFM knows what the company is. A partial profile is enough.
        </p>
        <div className="mt-6 grid gap-4">
          <Field label="Organization" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Field label="Product" value={productName} onChange={(e) => setProductName(e.target.value)} />
          <TextArea
            label="Description (optional)"
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
          />
          <Field label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <Field
            label="Target audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>
        {error ? <p className="mt-4 text-sm text-orange">{error}</p> : null}
        <Button type="submit" className="mt-6 w-full">
          Continue to dashboard
        </Button>
      </form>
    </main>
  );
}
