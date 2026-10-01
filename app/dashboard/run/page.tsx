"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AttentionBars, Button, Field, ScoreBoard } from "@/components/ui";
import { getProfile } from "@/lib/session";

const EASE = [0.16, 1, 0.3, 1] as const;

/* The brand UI kit specifies an empty state, a loading state and an error
   state for upload. The previous version had a disabled button and nothing
   else, so a first-time user could not tell why nothing happened. */

export default function TestPage() {
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [objective, setObjective] = useState("Brand awareness");
  const [platform, setPlatform] = useState("Instagram");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const profile = getProfile();
    if (!profile) return;
    setLocation(profile.country);
    setAge(profile.targetAudience);
  }, []);

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName("");
      setFileError("");
      return;
    }
    const ok = ["video/mp4", "video/quicktime", "image/png", "image/jpeg"];
    if (!ok.includes(file.type)) {
      setFileName("");
      setFileError("That file type is not supported. Try MP4, MOV, PNG or JPG.");
      return;
    }
    setFileError("");
    setFileName(file.name);
  }

  function run() {
    if (!fileName || running) return;
    setRunning(true);
    window.setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 900);
  }

  const uploadState = fileError ? "error" : fileName ? "ready" : "empty";

  return (
    <div className="grid min-w-0 gap-8">
      <div className="min-w-0">
        <h1 className="text-[26px] font-semibold tracking-tight text-cream">
          Test Campaigns using NMFM
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2">
          Upload a creative and read the seven scores. Sample figures. NMFM is not connected.
        </p>
      </div>

      <motion.label
        htmlFor="creative"
        data-reveal=""
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`relative flex min-h-[200px] w-full min-w-0 cursor-pointer flex-col items-start justify-between gap-6 rounded-[16px] border px-6 py-6 transition-[border-color,background-color] duration-200 sm:min-h-[240px] sm:px-8 sm:py-8 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
          fileError
            ? "border-[#e5484d]/70 bg-[#8c2f04]/10"
            : "border-line bg-raised hover:border-line-strong"
        }`}
      >
        <span
          className={`rounded-[7px] border px-3 py-1 text-xs ${
            uploadState === "error"
              ? "border-[#e5484d] text-ink-2"
              : uploadState === "ready"
                ? "border-brand text-cream"
                : "border-line text-ink-2"
          }`}
        >
          {uploadState === "error" ? "Error" : uploadState === "ready" ? "Ready" : "Empty"}
        </span>
        <span className="block w-full min-w-0">
          <span className="block max-w-full break-all text-[22px] font-semibold tracking-tight text-cream sm:text-2xl">
            {fileName || "Drop a campaign creative"}
          </span>
          <span
            className={`mt-2 block max-w-xl text-sm ${fileError ? "text-[#ff8f8f]" : "text-ink-2"}`}
            role={fileError ? "alert" : undefined}
          >
            {fileError || "MP4, MOV, PNG, JPG. Nothing is uploaded in this build."}
          </span>
        </span>
        <span className="text-sm text-ink-3">Browse files</span>
        <input
          id="creative"
          type="file"
          accept="video/mp4,video/quicktime,image/png,image/jpeg"
          onChange={onFile}
          className="sr-only"
        />
      </motion.label>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Field label="Objective" name="objective" value={objective} onChange={(e) => setObjective(e.target.value)} />
        <Field label="Platform" name="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} />
        <Field label="Age group" name="age" value={age} onChange={(e) => setAge(e.target.value)} />
        <Field label="Location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <div>
        <Button onClick={run} disabled={!fileName || running} className="w-fit">
          {running ? "Running test" : "Run NMFM test"}
        </Button>
        {!fileName && !fileError ? (
          <p className="mt-3 text-xs text-ink-4">Add a creative to enable the test.</p>
        ) : null}
      </div>

      {running ? (
        <div className="rounded-[16px] border border-line bg-raised p-5 sm:p-6" role="status">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[18px] font-semibold tracking-tight text-cream">Mapping attention</p>
            <span className="rounded-[7px] border border-brand px-3 py-1 text-xs text-ink-2">Loading</span>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-[4px] bg-line">
            <motion.div
              data-reveal=""
              className="h-full origin-left rounded-[4px] bg-cream"
              initial={reduce ? false : { scaleX: 0.08 }}
              animate={{ scaleX: 0.92 }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
            />
          </div>
          <p className="mt-3 text-xs text-ink-3">Sample run. This resolves in about a second.</p>
        </div>
      ) : null}

      {ran && !running ? (
        <motion.div
          data-reveal=""
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid min-w-0 gap-4"
        >
          <ScoreBoard />
          <div className="rounded-[16px] border border-line bg-raised p-5 sm:p-6">
            <p className="text-[18px] font-semibold tracking-tight text-cream">Attention timeline</p>
            <p className="mt-1 text-sm text-ink-2">
              Peaks early, drops mid-spot, re-engages late.
            </p>
            <div className="mt-4">
              <AttentionBars />
            </div>
            <p className="sample-flag mt-4">Sample shape. Not output from NMFM.</p>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
