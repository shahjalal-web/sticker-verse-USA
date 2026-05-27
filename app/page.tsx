import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllCollections } from "@/lib/shopify-collections";
import AnimatedClientWrapper from "./AnimatedClientWrapper";

const FEATURES = [
  { num: '01', title: 'Ultra Premium Vinyl', desc: 'Crafted with laboratory-grade vinyl designed to withstand the harshest cosmic radiation and everyday wear.', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { num: '02', title: 'Precision Die-Cut', desc: 'Micro-engineered laser cutting ensures flawless edges that seamlessly blend into any surface.', icon: 'M6 10a4 4 0 100-8 4 4 0 000 8zm12 0a4 4 0 100-8 4 4 0 000 8z M12 12v10' },
  { num: '03', title: 'Vibrant UV Ink', desc: 'Hyper-pigmented, UV-cured inks that lock in color depth and prevent fading under the blazing sun.', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707' },
  { num: '04', title: 'Infinite Designs', desc: 'A constantly expanding multiverse of community-driven artwork and limited-edition drops.', icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
];

export default async function HomePage() {
  const collections = await getAllCollections();

  return (
    <AnimatedClientWrapper>
      <main className="bg-[#060608] text-white min-h-screen w-full selection:bg-indigo-500 selection:text-white overflow-x-hidden">
        
        {/* ══════════════════════════════════════════
            HERO SECTION
           ══════════════════════════════════════════ */}
        <section className="relative min-h-[96vh] flex flex-col items-center justify-center text-center py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(90,70,210,0.22),transparent_60%)]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(50,30,140,0.12),transparent_70%)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(90,70,200,0.04),transparent_65%)]" />
          </div>

          <div 
            className="absolute inset-0 -z-10 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="flex flex-col items-center w-full max-w-4xl mx-auto z-10">
            
            {/* Shipping Badge */}
            <div className="inline-flex items-center gap-2.5 border border-white/[0.08] bg-white/[0.02] px-5 py-2 mb-8 backdrop-blur-md rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-semibold"
                style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
              >
                Free Shipping on Orders $50+
              </span>
            </div>

            {/* Master Headline */}
            <h1
              className="font-black tracking-tighter leading-[0.9] mb-6"
              style={{
                fontFamily: "var(--font-orbitron, sans-serif)",
                fontSize: "clamp(2.5rem, 11vw, 7.5rem)",
              }}
            >
              MAKE IT <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                STICK.
              </span>
            </h1>

            {/* Sub-headline Description */}
            <p className="text-zinc-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed font-normal">
              Premium custom stickers, banners, magnets &amp; laser engraving — 
              crafted to last, designed to impress.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20">
              <Link
                href="#categories"
                className="inline-flex items-center justify-center gap-2 bg-white text-black text-xs font-bold px-10 py-4 tracking-[0.2em] uppercase transition-all duration-300 hover:bg-zinc-200 active:scale-[0.98]"
                style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
              >
                Shop Now →
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 border border-white/[0.12] text-zinc-300 text-xs px-10 py-4 tracking-[0.2em] uppercase hover:border-white/30 hover:text-white hover:bg-white/[0.02] transition-all duration-300 active:scale-[0.98]"
                style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
              >
                My Account
              </Link>
            </div>

            {/* Trust Stats Counter */}
            <div className="grid grid-cols-2 md:flex items-center justify-center gap-8 md:gap-16 border-t border-white/[0.05] pt-10 w-full">
              {[
                { value: "10K+", label: "Orders Shipped" },
                { value: "48hr", label: "Turnaround"     },
                { value: "100%", label: "Satisfaction"   },
                { value: "4.9★", label: "Avg. Rating"    },
              ].map((stat) => (
                <div key={stat.label} className="text-center group cursor-default">
                  <p
                    className="text-2xl md:text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-zinc-500 tracking-[0.25em] uppercase mt-1.5 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Futuristic Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-60">
            <span className="text-[9px] tracking-[0.4em] uppercase text-zinc-600" style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}>
              Scroll
            </span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-zinc-700 via-zinc-900 to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-indigo-500 animate-bounce" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CATEGORIES SECTION
           ══════════════════════════════════════════ */}
        <section id="categories" className="px-4 sm:px-6 lg:px-8 py-28 max-w-[1400px] mx-auto scroll-mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16 border-b border-white/[0.05] pb-6">
            <div>
              <p
                className="text-[10px] tracking-[0.4em] uppercase text-indigo-400 font-semibold mb-2"
                style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
              >
                Browse Multiverse
              </p>
              <h2
                className="text-3xl md:text-4xl font-black text-white uppercase mt-4"
                style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
              >
                Product Categories
              </h2>
            </div>
            {collections.length > 0 && (
              <p className="text-xs text-zinc-500 tracking-wider font-mono">
                // {collections.length} {collections.length === 1 ? "category" : "categories"} loaded
              </p>
            )}
          </div>

          {collections.length === 0 ? (
            <p className="text-zinc-500 text-center py-20 font-medium">No categories found at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.handle}`}
                  className="group relative flex flex-col overflow-hidden border border-white/[0.05] bg-[#0c0c0e] hover:border-white/[0.15] transition-all duration-500 rounded-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                    {col.image ? (
                      <Image
                        src={col.image.url}
                        alt={col.image.altText ?? col.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                        <span
                          className="text-8xl font-black text-white/[0.02] select-none"
                          style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
                        >
                          {col.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-90" />
                  </div>

                  <div className="p-6 flex items-center justify-between gap-4 z-10 bg-[#0c0c0e]">
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-sm font-bold tracking-[0.1em] uppercase text-zinc-200 group-hover:text-white transition-colors duration-200 truncate"
                        style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
                      >
                        {col.title}
                      </h3>
                      {col.description && (
                        <p className="text-zinc-500 text-xs mt-1.5 line-clamp-1 leading-relaxed font-normal">
                          {col.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-white/[0.06] flex items-center justify-center text-zinc-500 bg-zinc-900/50 group-hover:border-indigo-500/40 group-hover:text-indigo-400 group-hover:bg-indigo-500/[0.04] transition-all duration-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform duration-200">
                        <path d="m5 12 14 0M13 6l6 6-6 6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════
            BUILT DIFFERENT (FEATURES) SECTION
           ══════════════════════════════════════════ */}
        <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0a0c] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none -z-10">
            {/* এখানে ভুল w-150 এবং h-150 ক্লাস পরিবর্তন করে ভ্যালিড Tailwind রেস্পন্সিভ রেম দেওয়া হয়েছে */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 md:w-[600px] md:h-[600px] bg-indigo-500/5 blur-[130px] rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 md:w-[400px] md:h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-3">
              <p 
                className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.5em]"
                style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
              >
                Why Stickerverse
              </p>
              <h2 
                className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase"
                style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
              >
                Built <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Different</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="relative group p-8 rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 backdrop-blur-md overflow-hidden select-none"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(400px_circle_at_50%_0px,rgba(99,102,241,0.06),transparent)] pointer-events-none" />

                  <span
                    className="absolute top-2 right-4 text-[5.5rem] font-black text-white/[0.015] leading-none pointer-events-none group-hover:text-indigo-500/[0.04] group-hover:scale-105 transition-all duration-500 transform origin-top-right"
                    style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
                  >
                    {f.num}
                  </span>

                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-400/60 transition-all duration-700" />

                  <div className="relative z-10 mb-8">
                    <div className="w-12 h-12 rounded-xl border border-white/[0.08] flex items-center justify-center bg-zinc-900/60 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/[0.05] shadow-xl transition-all duration-300">
                      <svg
                        width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="text-zinc-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300"
                      >
                        <path d={f.icon} />
                      </svg>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3">
                    <h3
                      className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-200 group-hover:text-white transition-colors duration-300"
                      style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-zinc-500 text-[13px] leading-6 group-hover:text-zinc-300 transition-colors duration-300 font-normal">
                      {f.desc}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-500 ease-out" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA BANNER SECTION
           ══════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 pb-28">
          <div className="max-w-[1400px] mx-auto">
            <div className="relative border border-white/[0.06] rounded-2xl p-10 md:p-20 text-center overflow-hidden bg-[#09090b]">
              <div className="absolute inset-0 -z-10 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(79,70,229,0.15) 0%, transparent 75%)" }}
              />
              
              <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-indigo-500/40 to-transparent" />
              <div className="absolute top-0 left-0 h-24 w-px bg-gradient-to-b from-indigo-500/40 to-transparent" />
              <div className="absolute bottom-0 right-0 w-24 h-px bg-gradient-to-l from-purple-500/30 to-transparent" />
              <div className="absolute bottom-0 right-0 h-24 w-px bg-gradient-to-t from-purple-500/30 to-transparent" />

              <p
                className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold mb-4"
                style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
              >
                Get Started Today
              </p>
              <h2
                className="text-3xl md:text-5xl font-black text-white uppercase mb-6 tracking-tight"
                style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
              >
                Ready to make <br /> your mark?
              </h2>
              <p className="text-zinc-400 max-w-md mx-auto mb-10 text-sm leading-7 font-normal">
                Upload your custom design, receive an instant digital proof, and get your entire order 
                precision manufactured and shipped in 48 hours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
                <Link
                  href="/#categories"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-black text-xs font-bold px-10 py-4 tracking-[0.2em] uppercase transition-all duration-300 hover:bg-zinc-200 active:scale-[0.98]"
                  style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
                >
                  Order Now →
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto border border-white/10 text-zinc-400 text-xs px-10 py-4 tracking-[0.2em] uppercase hover:border-white/30 hover:text-white hover:bg-white/[0.01] transition-all duration-300 active:scale-[0.98]"
                  style={{ fontFamily: "var(--font-orbitron, sans-serif)" }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AnimatedClientWrapper>
  );
}