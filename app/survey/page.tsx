"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, LogoLink, TextArea } from "@/components/ui";
import { FoxMark } from "@/components/fox-mark";
import { getProfile, getSession, setProfile } from "@/lib/session";

/* Single step on purpose. Do not split this into a wizard. Errors stay on the
   field that failed. The skeleton covers the localStorage read. */

type Errors = Partial<Record<"companyName" | "productName" | "country" | "targetAudience", string>>;

function SurveyFrame({ children }: { children: ReactNode }) {
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
          <div className="mx-auto my-auto w-full max-w-lg">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function SurveyPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [country, setCountry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [errors, setErrors] = useState<Errors>({});

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
    const next: Errors = {};
    if (!companyName.trim()) next.companyName = "Required";
    if (!productName.trim()) next.productName = "Required";
    if (!country.trim()) next.country = "Required";
    if (!targetAudience.trim()) next.targetAudience = "Required";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

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

  if (!ready) {
    return (
      <SurveyFrame>
        <div className="animate-pulse" aria-hidden="true">
          <div className="h-7 w-56 rounded-[10px] bg-raised" />
          <div className="mt-3 h-4 w-72 rounded-[10px] bg-raised" />
          <div className="mt-8 grid gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-[10px] bg-raised" />
            ))}
          </div>
        </div>
      </SurveyFrame>
    );
  }

  return (
    <SurveyFrame>
      <form onSubmit={onSubmit} noValidate>
        <p className="truncate text-xs text-ink-4">{email}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tighter text-cream">
          Basic company details
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Saved on this device. A partial profile is enough.
        </p>

        <div className="mt-7 grid gap-4">
          <Field
            label="Organization"
            name="companyName"
            autoComplete="organization"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            error={errors.companyName}
          />
          <Field
            label="Product"
            name="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            error={errors.productName}
          />
          <TextArea
            label="Description"
            name="companyDescription"
            hint="Optional."
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
          />
          <Field
            label="Country"
            name="country"
            autoComplete="country-name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            error={errors.country}
          />
          <Field
            label="Target audience"
            name="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            error={errors.targetAudience}
          />
        </div>

        <Button type="submit" className="mt-7 w-full">
          Continue to dashboard
        </Button>
      </form>
    </SurveyFrame>
  );
}
