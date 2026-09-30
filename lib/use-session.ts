"use client";

import { useEffect, useState } from "react";
import { getProfile, getSession, type Profile, type Session } from "./session";

export function useSession() {
  const [session, setSessionState] = useState<Session | null>(null);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSessionState(getSession());
    setProfileState(getProfile());
    setReady(true);
  }, []);

  return { session, profile, ready };
}
