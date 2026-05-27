import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Stickerverse USA",
  description: "Learn about Stickerverse USA — who we are, what we stand for, and why thousands of customers trust us for premium custom stickers.",
};

const STATS = [
  { value: "50K+",  label: "Orders Shipped"    },
  { value: "48hr",  label: "Avg. Turnaround"   },
  { value: "100%",  label: "Satisfaction Rate" },
  { value: "12+",   label: "Years in Business" },
];

const VALUES = [
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Uncompromising Quality",
    desc:  "We use only premium vinyl, UV-resistant inks, and precision die-cut technology. Every order is inspected before it ships.",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Lightning Fast",
    desc:  "From proof approval to your doorstep in as little as 48 hours. Rush processing available for time-sensitive orders.",
  },
  {
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    title: "Customer First",
    desc:  "Not happy? We'll reprint it. Free. No hoops, no hassle. Your satisfaction is the only metric we care about.",
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Fair Pricing",
    desc:  "Tiered bulk discounts that actually save you money. The more you order, the more you save — up to 55% off at 1,000+ pieces.",
  },
];

const TEAM = [
  {
    initials: "JV",
    name:     "Josh Vargas",
    role:     "Founder & CEO",
    bio:      "Josh started Stickerverse in his garage with a single plotter and a vision to make premium custom stickers accessible to everyone.",
  },
  {
    initials: "ML",
    name:     "Maria Lopez",
    role:     "Head of Production",
    bio:      "With 10+ years in print production, Maria ensures every single order meets our exacting quality standards before it leaves the building.",
  },
  {
    initials: "TN",
    name:     "Tyler Nash",
    role:     "Customer Success",
    bio:      "Tyler and his team are obsessed with making sure every customer is thrilled with their order — from first proof to final delivery.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative px-6 pt-16 pb-20 text-center overflow-hidden">
        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(100,80,220,0.11) 0%, transparent 68%)" }}
        />

        <div className="relative">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-7 animate-fade-in">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
            <span
              className="text-[8px] tracking-[0.55em] uppercase text-gray-500"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Our Story
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none text-shimmer animate-fade-up"
            style={{ fontFamily: "var(--font-orbitron)", animationFillMode: "both" }}
          >
            Built for Makers.<br />
            <span className="text-gray-300">Obsessed with Quality.</span>
          </h1>

          <p
            className="text-gray-400 mt-7 max-w-xl mx-auto text-sm leading-7 animate-fade-up delay-150"
            style={{ animationFillMode: "both" }}
          >
            Stickerverse USA was born from a simple belief — premium custom stickers
            shouldn't require a massive budget or a design degree. We handle the
            hard part so you can focus on creating.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300"
            style={{ animationFillMode: "both" }}
          >
            <Link
              href="/#categories"
              className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase px-8 py-4 bg-white text-black hover:bg-gray-100 transition-colors duration-200"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Shop Now
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m5 12 14 0M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase px-8 py-4 border border-white/[0.12] text-gray-300 hover:border-white/30 hover:text-white transition-all duration-200"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="h-px mt-20 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
      </section>

      {/* ── Stats ── */}
      <section className="px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] border border-white/[0.05]">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-[#060608] px-8 py-10 text-center group hover:bg-white/[0.02] transition-colors duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <p
                className="text-4xl md:text-5xl font-bold text-white group-hover:text-shimmer transition-all duration-300"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {stat.value}
              </p>
              <p
                className="text-[8px] tracking-[0.4em] uppercase text-gray-600 mt-2"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-white/[0.07] p-10 md:p-14 overflow-hidden">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-10 h-10 border-t border-l border-white/20" />
            <span className="absolute top-0 right-0 w-10 h-10 border-t border-r border-white/20" />
            <span className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-white/20" />
            <span className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-white/20" />

            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(80,60,200,0.06) 0%, transparent 70%)" }}
            />

            <div className="relative text-center">
              <p
                className="text-[8px] tracking-[0.5em] uppercase text-gray-600 mb-6"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Our Mission
              </p>
              <blockquote
                className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                &ldquo;To give every creator, brand, and business access to
                <span className="text-shimmer"> professional-grade custom stickers</span>
                &nbsp;— without the professional-grade price tag.&rdquo;
              </blockquote>
              <p className="text-gray-500 text-sm mt-6">— Josh Vargas, Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[8px] tracking-[0.5em] uppercase text-gray-500"
              style={{ fontFamily: "var(--font-orbitron)" }}>
              What We Stand For
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
          </div>
          <h2
            className="text-2xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Our Core Values
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="group border border-white/[0.07] hover:border-white/[0.18] bg-white/[0.015] hover:bg-white/[0.03] p-7 flex flex-col gap-5 transition-all duration-400 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className="w-11 h-11 border border-white/[0.1] flex items-center justify-center text-gray-500 group-hover:border-white/25 group-hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={v.icon} />
                </svg>
              </div>
              <div>
                <h3
                  className="text-xs font-bold tracking-[0.12em] uppercase text-white mb-3"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {v.title}
                </h3>
                <p className="text-gray-500 text-xs leading-6">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[8px] tracking-[0.5em] uppercase text-gray-500"
              style={{ fontFamily: "var(--font-orbitron)" }}>
              The People Behind It
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
          </div>
          <h2
            className="text-2xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Meet the Team
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className="group border border-white/[0.07] hover:border-white/[0.18] bg-white/[0.015] hover:bg-white/[0.03] p-7 text-center transition-all duration-400 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
            >
              {/* Avatar */}
              <div className="w-16 h-16 border border-white/[0.1] flex items-center justify-center mx-auto mb-5 group-hover:border-white/25 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(100,80,220,0.15)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <span
                  className="text-lg font-bold text-gray-400 group-hover:text-white transition-colors duration-300 relative"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {member.initials}
                </span>
              </div>
              <h3
                className="text-xs font-bold tracking-[0.1em] uppercase text-white mb-1"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {member.name}
              </h3>
              <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600 mb-4"
                style={{ fontFamily: "var(--font-orbitron)" }}>
                {member.role}
              </p>
              <p className="text-gray-500 text-xs leading-5">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 text-center">
        <div className="relative max-w-2xl mx-auto border border-white/[0.07] p-12 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(80,60,200,0.07) 0%, transparent 70%)" }}
          />
          <span className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20" />
          <span className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20" />

          <div className="relative">
            <p
              className="text-[8px] tracking-[0.5em] uppercase text-gray-600 mb-5"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Ready to Create?
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Your Design, Our Craft.
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Upload your artwork and get a free digital proof in minutes.
            </p>
            <Link
              href="/#categories"
              className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase px-10 py-4 bg-white text-black hover:bg-gray-100 transition-colors duration-200"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Start Your Order
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m5 12 14 0M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
