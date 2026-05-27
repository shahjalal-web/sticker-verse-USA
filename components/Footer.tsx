import Link from "next/link";

const SHOP_LINKS = [
  { label: "All Products",    href: "/#categories" },
  { label: "Custom Stickers", href: "/collections/custom-stickers-logos" },
  { label: "Custom Banners",  href: "/collections/custom-banners" },
  { label: "Custom Magnets",  href: "/collections/custom-magnets" },
  { label: "Laser Engraving", href: "/collections/coming-soon" },
];

const ACCOUNT_LINKS = [
  { label: "Log In",      href: "/login" },
  { label: "Sign Up",     href: "/signup" },
  { label: "My Orders",   href: "/account" },
  { label: "My Account",  href: "/account" },
];

export default function Footer() {
  return (
    <footer className="relative mt-24">
      {/* Top gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

      <div className="bg-[#040406]/80 backdrop-blur-sm">
        {/* Main grid */}
        <div className="px-6 pt-16 pb-10" style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="grid gap-12 lg:grid-cols-12">

            {/* ── Brand ── */}
            <div className="lg:col-span-5">
              <Link href="/" style={{ fontFamily: "var(--font-orbitron)" }} className="inline-block mb-5">
                <span className="text-white font-extrabold text-base tracking-[0.18em] uppercase">Stickerverse</span>
                <span className="text-gray-500 font-bold text-base tracking-[0.18em] uppercase"> USA</span>
              </Link>

              <p className="max-w-xs text-sm leading-7 text-gray-500 mb-6">
                High-quality custom stickers, banners, magnets, and laser engraving — built to last, designed to impress.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { v: "10K+", l: "Orders" },
                  { v: "48hr", l: "Turnaround" },
                  { v: "4.9★", l: "Rating" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-center hover:border-white/[0.12] transition-colors duration-300"
                  >
                    <p className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-orbitron)" }}>{s.v}</p>
                    <p className="text-[9px] text-gray-600 tracking-[0.25em] uppercase mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Social icons */}
              <div className="flex gap-2">
                {[
                  {
                    label: "Instagram",
                    href: "https://www.instagram.com/stickerverseusa",
                    path: (
                      <>
                        <rect width="20" height="20" x="2" y="2" rx="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </>
                    ),
                  },
                  {
                    label: "Facebook",
                    href: "https://www.facebook.com/stickerverseusa",
                    path: (
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2.5v-3H10V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    ),
                    fill: true,
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center border border-white/[0.08] text-gray-500 hover:border-white/25 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <svg
                      width="15" height="15" viewBox="0 0 24 24"
                      fill={social.fill ? "currentColor" : "none"}
                      stroke={social.fill ? "none" : "currentColor"}
                      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                    >
                      {social.path}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Shop ── */}
            <div className="lg:col-span-2">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-white mb-5"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Shop
              </p>
              <ul className="space-y-3">
                {SHOP_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-gray-600">→</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Account ── */}
            <div className="lg:col-span-2">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-white mb-5"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Account
              </p>
              <ul className="space-y-3">
                {ACCOUNT_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-gray-600">→</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Contact + Trust ── */}
            <div className="lg:col-span-3">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-white mb-5"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Contact
              </p>

              <a
                href="mailto:stickerverseusa@gmail.com"
                className="flex items-center gap-2.5 text-[13px] text-gray-500 hover:text-white transition-colors duration-200 mb-6"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                stickerverseusa@gmail.com
              </a>

              {/* Trust badges */}
              <div className="space-y-2.5">
                {[
                  "Free shipping on orders over $50",
                  "Satisfaction guaranteed or we reprint",
                  "Secure SSL checkout",
                ].map((txt) => (
                  <div key={txt} className="flex items-start gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500 flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[12px] text-gray-600 leading-relaxed">{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05]">
          <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>
            <span className="text-[11px] text-gray-700">
              © {new Date().getFullYear()} Stickerverse USA. All rights reserved.
            </span>
            <div className="flex gap-6">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Refund Policy", href: "#" },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="text-[11px] text-gray-700 hover:text-gray-400 transition-colors duration-200">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
