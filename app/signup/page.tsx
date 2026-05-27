"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [marketing, setMarketing] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/account";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);

    const res  = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, acceptsMarketing: marketing }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Signup failed"); return; }
    if (data.requiresManualLogin) { router.push("/login"); return; }
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
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
                Create Account
              </h1>
              <p className="text-gray-500 text-sm">Join thousands of happy customers</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-orbitron)" }}>
                    First Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.10] text-white text-sm px-4 py-3.5 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] placeholder:text-gray-700 transition-all duration-200"
                    placeholder="Josh"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-orbitron)" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.10] text-white text-sm px-4 py-3.5 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] placeholder:text-gray-700 transition-all duration-200"
                    placeholder="Smith"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] text-gray-500 mb-2 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  Email address*
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
              <div>
                <label className="block text-[10px] text-gray-500 mb-2 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  Password* (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] text-white text-sm px-4 py-3.5 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] placeholder:text-gray-700 transition-all duration-200"
                  placeholder="••••••••"
                />
                {/* Strength hint */}
                {password.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="h-0.5 flex-1 rounded-full transition-colors duration-300"
                        style={{
                          background: password.length >= level * 4
                            ? level === 1 ? "#ef4444" : level === 2 ? "#f59e0b" : "#22c55e"
                            : "rgba(255,255,255,0.1)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Marketing */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border border-white/20 bg-white/[0.04] peer-checked:bg-white peer-checked:border-white transition-all duration-200 flex items-center justify-center">
                    {marketing && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[12px] text-gray-500 group-hover:text-gray-300 transition-colors leading-relaxed">
                  Receive exclusive deals and updates via email
                </span>
              </label>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-500/[0.08] border border-red-500/20 px-4 py-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-4 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-all duration-200 disabled:opacity-40"
                style={{ fontFamily: "var(--font-orbitron)", background: "#ffffff", color: "#000000" }}
              >
                {loading ? "Creating account…" : "Create Account →"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-7 text-center text-[12px] text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline underline-offset-2 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
