import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import Button from "../components/ui/Button";
import { useAuth } from "../lib/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);

    if (!res.ok) {
      setError(res.error ?? "Something went wrong. Please try again.");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <div className="px-6 sm:px-10 h-16 flex items-center gap-2.5">
        <Link to="/" className="flex items-center gap-2.5 focus-ring rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <ShieldCheck size={18} className="text-black" />
          </div>
          <span className="font-semibold tracking-tight text-lg">REBOOT</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm animate-fade-in">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Sign in to continue your progress.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <div>
              <label htmlFor="si-email" className="text-sm font-medium mb-2 block">Email</label>
              <input
                id="si-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="focus-ring w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
              />
            </div>
            <div>
              <label htmlFor="si-password" className="text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <input
                  id="si-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="focus-ring w-full px-3.5 py-2.5 pr-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-[var(--red)] bg-[var(--red)]/10 rounded-lg px-3.5 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          <p className="text-xs text-[var(--muted)] mt-4 text-center leading-relaxed">
            Accounts are stored only on this device — there's no password recovery.
          </p>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)]">or</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              continueAsGuest();
              navigate("/dashboard");
            }}
          >
            Continue as guest (view demo)
          </Button>

          <p className="text-sm text-[var(--muted)] text-center mt-6">
            New here?{" "}
            <Link to="/sign-up" className="text-[var(--primary)] font-medium focus-ring rounded">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
