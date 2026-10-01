"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, TextArea } from "@/components/ui";
import { getProfile, getSession, setProfile } from "@/lib/session";

export default function ProfilePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [country, setCountry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [saved, setSaved] = useState(false);

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
    const complete = Boolean(
      companyName.trim() && productName.trim() && country.trim() && targetAudience.trim(),
    );
    setProfile({
      email,
      companyName: companyName.trim(),
      productName: productName.trim(),
      companyDescription: companyDescription.trim(),
      country: country.trim(),
      targetAudience: targetAudience.trim(),
      status: complete ? "complete" : "partial",
    });
    setSaved(true);
  }

  if (!ready) {
    return (
      <div className="grid min-w-0 gap-8" aria-hidden="true">
        <div className="h-8 w-40 animate-pulse rounded-[10px] bg-raised" />
        <div className="h-80 animate-pulse rounded-[16px] bg-raised" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex min-h-full min-w-0 flex-col gap-8">
      <div className="min-w-0">
        <h1 className="break-words text-[26px] font-semibold tracking-tight text-cream">Profile</h1>
        <p className="mt-2 truncate text-sm text-ink-2">{email}</p>
      </div>

      <div className="flex-1 rounded-[16px] border border-line bg-raised p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Organization"
            name="companyName"
            autoComplete="organization"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Field
            label="Product"
            name="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <div className="sm:col-span-2">
            <TextArea
              label="Description"
              name="companyDescription"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
            />
          </div>
          <Field
            label="Country"
            name="country"
            autoComplete="country-name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <Field
            label="Target audience"
            name="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button type="submit">Save Changes</Button>
          <p role="status" aria-live="polite" className="text-sm text-ink-2">
            {saved ? "Saved." : ""}
          </p>
        </div>
      </div>
    </form>
  );
}
