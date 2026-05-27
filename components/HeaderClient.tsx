"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CartIcon from "./CartIcon";

export type HeaderCustomer = { firstName: string | null; displayName: string; email: string };
export type HeaderCollection = { handle: string; title: string };

export default function HeaderClient({
  customer,
  collections,
}: {
  customer: HeaderCustomer | null;
  collections: HeaderCollection[];
}) {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [accountOpen, setAccountOpen]   = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 30); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setAccountOpen(false);
    await fetch("/api/auth/logout", { method: "POST", headers: { Accept: "application/json" } });
    router.push("/");
    router.refresh();
  }

  const initial    = customer?.firstName?.charAt(0).toUpperCase() ?? customer?.email?.charAt(0).toUpperCase() ?? "?";
  const isHome     = pathname === "/";
  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-white/[0.07] bg-[#060608]/95 backdrop-blur-2xl shadow-xl shadow-black/30"
      }`}
    >
      <div className="px-4 sm:px-6 flex h-16 items-center justify-between gap-4" style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>

        {/* ── Logo ── */}
        <Link href="/" className="flex-shrink-0 group" style={{ fontFamily: "var(--font-orbitron)" }}>
          <span className="text-white font-extrabold text-sm tracking-[0.18em] uppercase group-hover:opacity-75 transition-opacity duration-200">
            Stickerverse
          </span>
          <span className="text-gray-500 font-bold text-sm tracking-[0.18em] uppercase"> USA</span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/",       label: "Home"    },
            { href: "/about",  label: "About"   },
            { href: "/contact",label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-[13px] tracking-wide transition-colors duration-200 py-1 ${
                pathname === item.href ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute -bottom-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              )}
            </Link>
          ))}

          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              className={`flex items-center gap-1.5 text-[13px] tracking-wide transition-colors duration-200 py-1 ${
                productsOpen ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Products
              <svg
                width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                className={`transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 transition-all duration-200 ${
                productsOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="bg-[#0c0c11] border border-white/10 shadow-2xl shadow-black/70 overflow-hidden">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {collections.length === 0 ? (
                  <p className="px-5 py-3 text-xs text-gray-500">No categories found.</p>
                ) : (
                  collections.map((col) => (
                    <Link
                      key={col.handle}
                      href={`/collections/${col.handle}`}
                      className="flex items-center justify-between px-5 py-3 text-[11px] font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-all duration-150 tracking-widest uppercase group"
                      style={{ fontFamily: "var(--font-orbitron)" }}
                      onClick={() => setProductsOpen(false)}
                    >
                      <span>{col.title}</span>
                      <span className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-150 text-sm">→</span>
                    </Link>
                  ))
                )}
                <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
            </div>
          </div>
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">
          <CartIcon />

          {/* Auth desktop */}
          <div className="hidden md:flex items-center gap-3">
            {customer ? (
              <div
                className="relative"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button className="flex items-center gap-2.5 group">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold group-hover:bg-white group-hover:text-black transition-all duration-200">
                    {initial}
                  </span>
                  <span className="text-[13px] text-gray-300 group-hover:text-white transition-colors max-w-[100px] truncate">
                    {customer.firstName ?? customer.email}
                  </span>
                </button>

                <div
                  className={`absolute right-0 top-full mt-3 w-48 transition-all duration-200 ${
                    accountOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="bg-[#0c0c11] border border-white/10 shadow-2xl shadow-black/70 overflow-hidden">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    {[
                      { href: "/account", label: "My Account",   icon: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-7 8a7 7 0 0 1 14 0" },
                      { href: "/account", label: "Order History", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-5 py-3 text-xs text-gray-300 hover:bg-white/[0.06] hover:text-white transition-all"
                        onClick={() => setAccountOpen(false)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d={item.icon} />
                        </svg>
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-xs text-gray-500 hover:bg-white/[0.06] hover:text-red-400 transition-all border-t border-white/5"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-[13px] text-gray-400 hover:text-white transition-colors duration-200">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-[13px] font-semibold bg-white text-black px-5 py-2 hover:bg-gray-100 transition-colors duration-200 tracking-wide"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1.5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 origin-center ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 origin-center ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-350 ease-in-out ${
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#060608]/98 backdrop-blur-2xl border-t border-white/[0.06] px-6 py-5 flex flex-col">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -mx-6 mb-4" />

          {[
            { href: "/",        label: "Home"    },
            { href: "/about",   label: "About"   },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`py-3.5 text-[13px] tracking-wide border-b border-white/[0.05] transition-colors ${
                pathname === item.href ? "text-white font-semibold" : "text-gray-400"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {collections.length > 0 && (
            <div className="py-2 border-b border-white/[0.05]">
              <p
                className="text-[9px] text-gray-600 tracking-[0.35em] uppercase py-3"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Products
              </p>
              {collections.map((col) => (
                <Link
                  key={col.handle}
                  href={`/collections/${col.handle}`}
                  className="block py-2.5 text-[11px] text-gray-400 hover:text-white tracking-[0.2em] uppercase transition-colors"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {col.title}
                </Link>
              ))}
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3">
            {customer ? (
              <>
                <Link href="/account" className="text-[13px] text-gray-300 py-1" onClick={() => setMenuOpen(false)}>
                  My Account
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="text-left text-[13px] text-gray-500 hover:text-red-400 transition-colors py-1"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[13px] text-gray-300 py-1" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-[13px] font-semibold bg-white text-black px-5 py-3 text-center hover:bg-gray-100 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
