import Link from "next/link";
import Image from "next/image";

const SUBCATEGORIES = [
  {
    title: "Vinyl Stickers",
    href: "/stickers/vinyl",
    img: "/Vinyl Stickers.png",
    gradient: "linear-gradient(145deg, #0b1437 0%, #1a2f6e 60%, #0d1a3a 100%)",
    glow: "rgba(75,105,230,0.35)",
  },
  {
    title: "QR Code Stickers",
    href: "/stickers/qr",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" />
      </svg>
    ),
    gradient: "linear-gradient(145deg, #1a0533 0%, #4a1272 40%, #2d0a5c 100%)",
    glow: "rgba(180,80,230,0.35)",
  },
  {
    title: "Easy Peel Stickers",
    href: "/stickers/easy-peel",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h12v12H4z" /><path d="M16 4l4 4v12H8l-4-4" /><path d="M16 4v4h4" />
      </svg>
    ),
    gradient: "linear-gradient(145deg, #1c1000 0%, #5c3200 50%, #2a1800 100%)",
    glow: "rgba(230,170,0,0.35)",
  },
  {
    title: "Sticker Sheets",
    href: "/stickers/sheets",
    img: "/Sticker Sheets.png",
    gradient: "linear-gradient(145deg, #001a12 0%, #04421e 50%, #001a12 100%)",
    glow: "rgba(60,190,100,0.35)",
  },
  {
    title: "Static Cling Stickers",
    href: "/stickers/static-cling",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <line x1="3" y1="12" x2="21" y2="12" /><line x1="12" y1="3" x2="12" y2="21" />
      </svg>
    ),
    gradient: "linear-gradient(145deg, #001220 0%, #0a3d5c 50%, #001220 100%)",
    glow: "rgba(80,190,230,0.35)",
  },
];

const TRUST_BADGES = [
  {
    label: "Waterproof & Extreme-Weather Tested",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
        <line x1="8" y1="16" x2="8.01" y2="16" /><line x1="8" y1="20" x2="8.01" y2="20" />
        <line x1="12" y1="18" x2="12.01" y2="18" /><line x1="12" y1="22" x2="12.01" y2="22" />
        <line x1="16" y1="16" x2="16.01" y2="16" /><line x1="16" y1="20" x2="16.01" y2="20" />
      </svg>
    ),
  },
  {
    label: "Premium Quality, Made in the USA",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "Free Online Proof With All Orders",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
];

export default function StickerSubcategoryView() {
  return (
    <section className="px-6 pb-16">
      <div className="max-w-5xl mx-auto">

        {/* ── Sub-category cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {SUBCATEGORIES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col rounded-xl overflow-hidden border border-white/7 hover:border-white/22 transition-all duration-400 hover:-translate-y-1.5"
              style={{
                background: item.gradient,
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              {/* Art area — image */}
              <div className="relative flex items-center justify-center flex-1 min-h-32.5 p-5 overflow-hidden">
                {/* Ambient glow behind image */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(60% 60% at 50% 55%, ${item.glow}, transparent)` }}
                />
                <div className="relative w-full h-27.5 group-hover:scale-110 transition-transform duration-400">
                  {item.img ? (
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-400 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                      {item.icon}
                    </div>
                  )}
                </div>
              </div>

              {/* Label */}
              <div
                className="px-4 py-3 flex items-center justify-between border-t border-white/6"
                style={{ background: "rgba(0,0,0,0.35)" }}
              >
                <span
                  className="text-[10px] sm:text-[11px] font-bold tracking-[0.08em] uppercase text-zinc-300 group-hover:text-white transition-colors duration-200 leading-snug"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {item.title}
                </span>
                <svg
                  width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 shrink-0 ml-2"
                >
                  <path d="m5 12 14 0M13 6l6 6-6 6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Trust badges ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRUST_BADGES.map(({ label, icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 border border-white/[0.07] bg-white/2 px-5 py-4 rounded-sm"
            >
              <div className="text-indigo-400 shrink-0">{icon}</div>
              <p className="text-xs text-gray-300 font-medium leading-snug">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
