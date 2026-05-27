"use client";

import { useState } from "react";
import Link from "next/link";

const CONTACT_METHODS = [
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Email Us",
    value: "hello@stickerverseusa.com",
    sub:   "We reply within 24 hours",
  },
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "Call Us",
    value: "+1 (800) 555-0190",
    sub:   "Mon–Fri, 9am–6pm EST",
  },
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Location",
    value: "Miami, Florida",
    sub:   "United States",
  },
];

const SUBJECTS = [
  "Order Status",
  "Custom Quote",
  "File / Artwork Help",
  "Billing Question",
  "Partnership / Wholesale",
  "Other",
];

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [name,      setName]    = useState("");
  const [email,     setEmail]   = useState("");
  const [subject,   setSubject] = useState(SUBJECTS[0]);
  const [message,   setMessage] = useState("");
  const [status,    setStatus]  = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus("loading");

    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  return (
    <main className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative px-6 pt-16 pb-16 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(100,80,220,0.1) 0%, transparent 68%)" }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-3 mb-7 animate-fade-in">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[8px] tracking-[0.55em] uppercase text-gray-500"
              style={{ fontFamily: "var(--font-orbitron)" }}>
              Get in Touch
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-none text-shimmer animate-fade-up"
            style={{ fontFamily: "var(--font-orbitron)", animationFillMode: "both" }}
          >
            We&rsquo;d Love to<br />
            <span className="text-gray-300">Hear From You</span>
          </h1>

          <p
            className="text-gray-400 mt-7 max-w-md mx-auto text-sm leading-7 animate-fade-up delay-150"
            style={{ animationFillMode: "both" }}
          >
            Questions about your order, artwork requirements, or pricing?
            Our team is standing by.
          </p>
        </div>

        <div className="h-px mt-16 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
      </section>

      {/* ── Contact cards ── */}
      <section className="px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {CONTACT_METHODS.map((m, i) => (
            <div
              key={m.label}
              className="group border border-white/[0.07] hover:border-white/[0.18] bg-white/[0.015] hover:bg-white/[0.03] p-7 text-center flex flex-col items-center gap-4 transition-all duration-400 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className="w-11 h-11 border border-white/[0.1] flex items-center justify-center text-gray-500 group-hover:border-white/25 group-hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={m.icon} />
                </svg>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600 mb-1.5"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  {m.label}
                </p>
                <p className="text-sm font-semibold text-white">{m.value}</p>
                <p className="text-xs text-gray-600 mt-1">{m.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact form ── */}
      <section className="px-6 py-12 pb-28">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
              <span className="text-[8px] tracking-[0.5em] uppercase text-gray-500"
                style={{ fontFamily: "var(--font-orbitron)" }}>
                Send a Message
              </span>
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Drop Us a Line
            </h2>
          </div>

          {status === "success" ? (
            <div
              className="border border-white/[0.09] bg-white/[0.02] p-12 text-center animate-scale-in"
              style={{ animationFillMode: "both" }}
            >
              <div className="w-14 h-14 border border-white/[0.1] flex items-center justify-center mx-auto mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3
                className="text-lg font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Message Sent!
              </h3>
              <p className="text-gray-400 text-sm mb-8">
                Thanks, {name.split(" ")[0]}. We&rsquo;ll be in touch within 24 hours.
              </p>
              <button
                onClick={() => { setName(""); setEmail(""); setMessage(""); setStatus("idle"); }}
                className="text-[10px] tracking-[0.25em] uppercase text-gray-500 hover:text-white border border-white/[0.07] hover:border-white/20 px-6 py-2.5 transition-all duration-200"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border border-white/[0.07] bg-white/[0.015] p-8 md:p-10 flex flex-col gap-6 animate-fade-up"
              style={{ animationFillMode: "both" }}
            >
              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[9px] tracking-[0.35em] uppercase text-gray-500"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    Full Name <span className="text-gray-700">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="bg-white/[0.03] border border-white/[0.08] text-white text-sm px-4 py-3 placeholder:text-gray-700 focus:outline-none focus:border-white/25 transition-colors duration-200"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[9px] tracking-[0.35em] uppercase text-gray-500"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    Email <span className="text-gray-700">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="bg-white/[0.03] border border-white/[0.08] text-white text-sm px-4 py-3 placeholder:text-gray-700 focus:outline-none focus:border-white/25 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[9px] tracking-[0.35em] uppercase text-gray-500"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-white/[0.03] border border-white/[0.08] text-white text-sm px-4 py-3 focus:outline-none focus:border-white/25 transition-colors duration-200 appearance-none cursor-pointer"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s} className="bg-[#0c0c11]">{s}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[9px] tracking-[0.35em] uppercase text-gray-500"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  Message <span className="text-gray-700">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project, order, or question..."
                  className="bg-white/[0.03] border border-white/[0.08] text-white text-sm px-4 py-3 placeholder:text-gray-700 focus:outline-none focus:border-white/25 transition-colors duration-200 resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="text-[10px] text-gray-600">
                  We reply within 24 hours on business days.
                </p>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase px-8 py-4 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m5 12 14 0M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-gray-600 text-xs mt-8">
            For order-related issues, have your order number ready.{" "}
            <Link href="/#categories" className="text-gray-400 hover:text-white transition-colors duration-200 underline underline-offset-2">
              Browse our products →
            </Link>
          </p>
        </div>
      </section>

    </main>
  );
}
