"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { clearAll, clearSession } from "@/lib/session";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="grid max-w-lg gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-cream/60">
          The product uses the neuro.ad dark brand. Theme is locked. Accounts and scores in this
          build are stored in localStorage. Nothing is uploaded.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            clearSession();
            router.push("/login");
          }}
        >
          Sign out
        </Button>
        <Button
          variant="orange"
          onClick={() => {
            clearAll();
            router.push("/signup");
          }}
        >
          Clear sample data on this device
        </Button>
      </div>
    </div>
  );
}
