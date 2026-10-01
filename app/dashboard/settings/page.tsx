"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { clearAll, clearSession } from "@/lib/session";

export default function SettingsPage() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex min-h-full min-w-0 flex-col gap-8">
      <div className="min-w-0">
        <h1 className="break-words text-[26px] font-semibold tracking-tight text-cream">Settings</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          The product uses the neuro.ad dark brand. Theme is locked. Accounts and scores in this
          build are stored in localStorage. Nothing is uploaded.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-2">
        <div className="rounded-[16px] border border-line bg-raised p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-tight text-cream">Session</h2>
          <p className="mt-2 text-sm text-ink-2">
            Ends this session on this device. Your profile is kept.
          </p>
          <Button
            variant="quiet"
            className="mt-5"
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
          >
            Sign Out
          </Button>
        </div>

        <div className="rounded-[16px] border border-line bg-raised p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-tight text-cream">Sample data</h2>
          <p className="mt-2 text-sm text-ink-2">
            Removes the session, company profile and connected socials from this browser. This
            cannot be undone.
          </p>

          {confirming ? (
            <div
              role="alertdialog"
              aria-labelledby="clear-title"
              className="mt-5 rounded-[10px] border border-line bg-sunken p-4"
            >
              <p id="clear-title" className="text-sm font-medium text-cream">
                Clear everything on this device?
              </p>
              <p className="mt-1 text-sm text-ink-2">
                You will need to sign up again and redo the survey.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="danger"
                  onClick={() => {
                    clearAll();
                    router.push("/signup");
                  }}
                >
                  Yes, Clear Sample Data
                </Button>
                <Button variant="quiet" onClick={() => setConfirming(false)}>
                  Keep My Data
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="quiet" className="mt-5" onClick={() => setConfirming(true)}>
              Clear Sample Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
