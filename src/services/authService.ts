import { genId, getItem, setItem } from "./storageService";
import { generateDemoData } from "../data/seed";
import { evaluateAchievements } from "../utils/achievements";

const AUTH_KEY = "reboot:auth";
const GUEST_ID = "guest";

export interface AuthAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface AuthState {
  accounts: AuthAccount[];
  currentUserId: string | null;
}

type AuthResult = { ok: true; account: AuthAccount } | { ok: false; error: string };

function defaultAuthState(): AuthState {
  return { accounts: [], currentUserId: null };
}

function readAuthState(): AuthState {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return defaultAuthState();
    const parsed = JSON.parse(raw);
    return { accounts: parsed.accounts ?? [], currentUserId: parsed.currentUserId ?? null };
  } catch (err) {
    console.error("REBOOT auth: failed to read auth state, resetting.", err);
    return defaultAuthState();
  }
}

function writeAuthState(state: AuthState): void {
  try {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("REBOOT auth: failed to persist auth state.", err);
  }
}

async function hashPassword(password: string): Promise<string> {
  try {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    // Extremely unlikely fallback if Web Crypto is unavailable.
    return btoa(unescape(encodeURIComponent(password)));
  }
}

export function getCurrentAccount(): AuthAccount | null {
  const state = readAuthState();
  if (!state.currentUserId) return null;
  return state.accounts.find((a) => a.id === state.currentUserId) ?? null;
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (!trimmedName) return { ok: false, error: "Please enter your name." };
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return { ok: false, error: "Please enter a valid email address." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const state = readAuthState();
  if (state.accounts.some((a) => a.email === normalizedEmail)) {
    return { ok: false, error: "An account with this email already exists on this device." };
  }

  const account: AuthAccount = {
    id: genId(),
    name: trimmedName,
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  writeAuthState({ accounts: [...state.accounts, account], currentUserId: account.id });
  return { ok: true, account };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const state = readAuthState();
  const account = state.accounts.find((a) => a.email === normalizedEmail);

  if (!account) return { ok: false, error: "No account found with this email on this device." };

  const passwordHash = await hashPassword(password);
  if (passwordHash !== account.passwordHash) {
    return { ok: false, error: "Incorrect password." };
  }

  writeAuthState({ ...state, currentUserId: account.id });
  return { ok: true, account };
}

export function signOut(): void {
  const state = readAuthState();
  writeAuthState({ ...state, currentUserId: null });
}

export function continueAsGuest(): AuthAccount {
  const state = readAuthState();
  let guest = state.accounts.find((a) => a.id === GUEST_ID);

  if (!guest) {
    guest = { id: GUEST_ID, name: "Guest", email: "", passwordHash: "", createdAt: new Date().toISOString() };
    writeAuthState({ accounts: [...state.accounts, guest], currentUserId: GUEST_ID });
  } else {
    writeAuthState({ ...state, currentUserId: GUEST_ID });
  }

  // Seed the guest profile with realistic demo data the first time it's used,
  // so "View Demo" leads straight to a populated dashboard.
  const existing = getItem(GUEST_ID);
  if (!existing.profile) {
    const demo = generateDemoData(78);
    setItem(GUEST_ID, { ...demo, achievements: evaluateAchievements(demo) });
  }

  return guest;
}

export function deleteAccount(userId: string): void {
  const state = readAuthState();
  writeAuthState({
    accounts: state.accounts.filter((a) => a.id !== userId),
    currentUserId: state.currentUserId === userId ? null : state.currentUserId,
  });
}
