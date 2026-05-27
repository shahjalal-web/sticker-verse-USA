import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCollectionByHandle, getAllCollections } from "@/lib/shopify-collections";

type Props = { params: Promise<{ handle: string }> };

export async function generateStaticParams() {
  const collections = await getAllCollections();
  return collections.map((c) => ({ handle: c.handle }));
}

export default async function CollectionPage({ params }: Props) {
  const { handle }  = await params;
  const collection  = await getCollectionByHandle(handle);
  if (!collection) notFound();

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ── Hero Header ── */}
      <section className="relative px-6 pt-10 pb-16 text-center overflow-hidden">
        {/* Ambient glow — centered */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(100,80,220,0.10) 0%, transparent 70%)" }}
        />

        {/* Back — top-left, doesn't disturb center layout */}
        <div className="relative flex justify-start mb-10 animate-fade-in">
          <Link
            href="/#categories"
            className="group inline-flex items-center gap-2.5"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <span className="w-8 h-8 border border-white/[0.08] flex items-center justify-center text-gray-500 group-hover:border-white/25 group-hover:text-white group-hover:bg-white/[0.04] transition-all duration-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className="group-hover:-translate-x-0.5 transition-transform duration-200">
                <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
              </svg>
            </span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-gray-500 group-hover:text-white transition-colors duration-300">
              All Categories
            </span>
          </Link>
        </div>

        {/* Centered content */}
        <div className="relative flex flex-col items-center">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-3 mb-6 animate-fade-in"
            style={{ animationFillMode: "both" }}
          >
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
            <span
              className="text-[8px] tracking-[0.55em] uppercase text-gray-500"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Collection
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none text-shimmer animate-fade-up"
            style={{ fontFamily: "var(--font-orbitron)", animationFillMode: "both" }}
          >
            {collection.title}
          </h1>

          {/* Description */}
          {collection.description && (
            <p
              className="text-gray-400 mt-6 max-w-lg text-sm leading-7 animate-fade-up delay-150"
              style={{ animationFillMode: "both" }}
            >
              {collection.description}
            </p>
          )}

          {/* Product count pill */}
          <div
            className="mt-8 inline-flex items-center gap-3 border border-white/[0.09] px-6 py-2.5 animate-scale-in delay-300"
            style={{ animationFillMode: "both" }}
          >
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {collection.products.length}
            </span>
            <span className="w-px h-4 bg-white/[0.1]" />
            <span
              className="text-[8px] tracking-[0.4em] uppercase text-gray-500"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {collection.products.length === 1 ? "Product" : "Products"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mt-14 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
      </section>

      {/* ── Products Grid ── */}
      <section className="px-6 pb-28">
        {collection.products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {collection.products.map((product, idx) => {
              const price    = product.minPrice ?? null;
              const currency = product.currencyCode ?? "USD";

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="group flex flex-col border border-white/[0.07] hover:border-white/[0.22] bg-white/[0.015] hover:bg-white/[0.035] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.55)] animate-fade-up"
                  style={{
                    animationDelay: `${idx * 55}ms`,
                    animationFillMode: "both",
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-5xl font-bold text-white/[0.05]"
                          style={{ fontFamily: "var(--font-orbitron)" }}
                        >
                          {product.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Hover dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/80 via-[#060608]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    {/* "View Product" label slides up */}
                    <div className="absolute bottom-0 inset-x-0 px-4 py-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 flex items-center gap-2">
                      <span
                        className="text-[8px] tracking-[0.35em] uppercase text-white"
                        style={{ fontFamily: "var(--font-orbitron)" }}
                      >
                        View Product
                      </span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="m5 12 14 0M13 6l6 6-6 6" />
                      </svg>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <h3
                      className="text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase text-gray-400 group-hover:text-white transition-colors duration-300 line-clamp-2 leading-relaxed"
                      style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.05]">
                      {price ? (
                        <div>
                          <p className="text-[8px] text-gray-600 tracking-[0.3em] uppercase mb-0.5"
                            style={{ fontFamily: "var(--font-orbitron)" }}>
                            From
                          </p>
                          <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                            {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(price))}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600">Price varies</p>
                      )}

                      <div className="w-8 h-8 border border-white/[0.07] flex items-center justify-center text-gray-600 group-hover:border-white/[0.28] group-hover:text-white group-hover:bg-white/[0.06] transition-all duration-300 flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                          className="group-hover:translate-x-0.5 transition-transform duration-200">
                          <path d="m5 12 14 0M13 6l6 6-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-36 animate-fade-in">
      <div className="relative w-24 h-24 border border-white/[0.07] flex items-center justify-center mx-auto mb-7">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(100,80,220,0.07)] to-transparent" />
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-gray-600">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>
      <p
        className="text-gray-500 text-xs tracking-[0.3em] uppercase mb-2"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        No Products Yet
      </p>
      <p className="text-gray-600 text-xs mb-10">This collection is coming soon.</p>
      <Link
        href="/#categories"
        className="group inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase px-8 py-4 bg-white text-black hover:bg-gray-100 transition-colors duration-200"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        Browse Other Categories
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className="group-hover:translate-x-0.5 transition-transform duration-200">
          <path d="m5 12 14 0M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
