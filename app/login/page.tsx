"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "recover";

function LoginForm() {
  const [mode, setMode]                   = useState<Mode>("login");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [showPwd, setShowPwd]             = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [success, setSuccess]             = useState("");
  const [needsSetup, setNeedsSetup]       = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/account";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(""); setNeedsSetup(false); setLoading(true);

    if (mode === "recover") {
      const res  = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      setSuccess(data.message ?? "Check your inbox.");
      return;
    }

    const res  = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      if (data.mayNeedPasswordSetup) setNeedsSetup(true);
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden"
    >
      {/* Page BG */}
      <div className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(80,60,200,0.12) 0%, transparent 60%)" }}
      />
      <div className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="w-full max-w-md animate-scale-in">
        {/* Card */}
        <div className="relative border border-white/[0.09] overflow-hidden"
          style={{ background: "rgba(8,8,12,0.85)", backdropFilter: "blur(24px)" }}>

          {/* Top accent */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

          <div className="px-8 py-10 md:px-10">
            {/* Brand */}
            <div className="text-center mb-10">
              <Link href="/" style={{ fontFamily: "var(--font-orbitron)" }} className="inline-block mb-6">
                <span className="text-white font-extrabold text-sm tracking-[0.18em] uppercase">Stickerverse</span>
                <span className="text-gray-600 font-bold text-sm tracking-[0.18em] uppercase"> USA</span>
              </Link>
              <h1
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {mode === "login" ? "Welcome back" : "Reset Password"}
              </h1>
              <p className="text-gray-500 text-sm">
                {mode === "login"
                  ? "Sign in to your account"
                  : "We'll send you a reset link"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div>
                <label className="block text-[10px] text-gray-500 mb-2 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] text-white text-sm px-4 py-3.5 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] placeholder:text-gray-700 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              {mode === "login" && (
                <div>
                  <label className="block text-[10px] text-gray-500 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-orbitron)" }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.10] text-white text-sm px-4 py-3.5 pr-12 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] placeholder:text-gray-700 transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPwd ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-500/[0.08] border border-red-500/20 px-4 py-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-start gap-2.5 bg-green-500/[0.08] border border-green-500/20 px-4 py-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <p className="text-green-400 text-xs leading-relaxed">{success}</p>
                </div>
              )}
              {needsSetup && (
                <button
                  type="button"
                  onClick={() => { setMode("recover"); setError(""); setNeedsSetup(false); }}
                  className="text-left text-xs text-gray-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Set / reset my password →
                </button>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-4 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-all duration-200 disabled:opacity-40"
                style={{ fontFamily: "var(--font-orbitron)", background: "#ffffff", color: "#000000" }}
              >
                {loading
                  ? "Please wait…"
                  : mode === "login"
                  ? "Sign In →"
                  : "Send Reset Link →"}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-7 flex flex-col items-center gap-3 text-sm text-gray-600">
              {mode === "login" ? (
                <>
                  <button
                    onClick={() => { setMode("recover"); setError(""); }}
                    className="text-[12px] hover:text-gray-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                  <p className="text-[12px]">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-white hover:underline underline-offset-2">
                      Sign up
                    </Link>
                  </p>
                </>
              ) : (
                <button
                  onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                  className="text-[12px] hover:text-gray-300 transition-colors"
                >
                  ← Back to sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
