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

  if (!ready) return null;

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-lg gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-2 text-sm text-cream/50">{email}</p>
      </div>
      <Field label="Organization" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      <Field label="Product" value={productName} onChange={(e) => setProductName(e.target.value)} />
      <TextArea
        label="Description"
        value={companyDescription}
        onChange={(e) => setCompanyDescription(e.target.value)}
      />
      <Field label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
      <Field
        label="Target audience"
        value={targetAudience}
        onChange={(e) => setTargetAudience(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button type="submit">Save</Button>
        {saved ? <p className="text-sm text-gold">Saved.</p> : null}
      </div>
    </form>
  );
}
