export type Provider = "google" | "github" | "facebook" | "email";

export type Session = {
  email: string;
  name: string;
  provider: Provider;
  utm?: string;
};

export type Profile = {
  email: string;
  companyName: string;
  productName: string;
  companyDescription: string;
  country: string;
  targetAudience: string;
  status: "partial" | "complete";
};

export type SocialState = {
  instagram: boolean;
  facebook: boolean;
  youtube: boolean;
};

const SESSION_KEY = "neuroad-session";
const PROFILE_KEY = "neuroad-profile";
const SOCIALS_KEY = "neuroad-socials";

const emptySocials: SocialState = {
  instagram: false,
  facebook: false,
  youtube: false,
};

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSession(): Session | null {
  return read<Session>(SESSION_KEY);
}

export function setSession(session: Session) {
  write(SESSION_KEY, session);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getProfile(): Profile | null {
  return read<Profile>(PROFILE_KEY);
}

export function setProfile(profile: Profile) {
  write(PROFILE_KEY, profile);
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

export function getSocials(): SocialState {
  return read<SocialState>(SOCIALS_KEY) ?? emptySocials;
}

export function setSocials(socials: SocialState) {
  write(SOCIALS_KEY, socials);
}

export function clearAll() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(SOCIALS_KEY);
}
