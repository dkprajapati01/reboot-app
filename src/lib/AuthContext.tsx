import React, { createContext, useCallback, useContext, useState } from "react";
import {
  type AuthAccount,
  getCurrentAccount,
  signUp as authSignUp,
  signIn as authSignIn,
  signOut as authSignOut,
  continueAsGuest as authContinueAsGuest,
} from "../services/authService";

interface AuthContextValue {
  account: AuthAccount | null;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AuthAccount | null>(() => getCurrentAccount());

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const res = await authSignUp(name, email, password);
    if (res.ok) {
      setAccount(res.account);
      return { ok: true as const };
    }
    return { ok: false as const, error: res.error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await authSignIn(email, password);
    if (res.ok) {
      setAccount(res.account);
      return { ok: true as const };
    }
    return { ok: false as const, error: res.error };
  }, []);

  const signOut = useCallback(() => {
    authSignOut();
    setAccount(null);
  }, []);

  const continueAsGuest = useCallback(() => {
    const guest = authContinueAsGuest();
    setAccount(guest);
  }, []);

  return (
    <AuthContext.Provider value={{ account, signUp, signIn, signOut, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
