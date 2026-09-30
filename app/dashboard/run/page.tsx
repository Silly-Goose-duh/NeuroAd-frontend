"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AttentionBars, Button, Field, ScoreBoard } from "@/components/ui";
import { getProfile } from "@/lib/session";

export default function TestPage() {
  const [fileName, setFileName] = useState("");
  const [objective, setObjective] = useState("Brand awareness");
  const [platform, setPlatform] = useState("Instagram");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [ran, setRan] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (!profile) return;
    setLocation(profile.country);
    setAge(profile.targetAudience);
  }, []);

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Test Campaigns using NMFM</h1>
        <p className="mt-2 text-sm text-cream/60">
          Sample scores. NMFM is not connected. These numbers are fixtures.
        </p>
      </div>

      <label className="block cursor-pointer rounded-2xl border border-dashed border-cream/20 p-8">
        <p className="font-medium">Drop a campaign creative</p>
        <p className="mt-1 text-sm text-cream/50">MP4, MOV, PNG, JPG. Nothing is uploaded.</p>
        <p className="mt-4 text-sm text-gold">{fileName || "No file selected"}</p>
        <input
          className="mt-4 block text-sm"
          type="file"
          accept="video/mp4,video/quicktime,image/png,image/jpeg"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Objective" value={objective} onChange={(e) => setObjective(e.target.value)} />
        <Field label="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)} />
        <Field label="Age group" value={age} onChange={(e) => setAge(e.target.value)} />
        <Field label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <Button disabled={!fileName} onClick={() => setRan(true)} className="w-fit">
        Run NMFM test
      </Button>

      {ran ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
          <ScoreBoard />
          <div className="rounded-2xl border border-cream/10 bg-ink p-5">
            <p className="text-sm font-medium">Attention timeline</p>
            <p className="mt-1 text-xs text-cream/50">
              Peaks early, drops mid-spot, re-engages late. Sample.
            </p>
            <div className="mt-4">
              <AttentionBars />
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
