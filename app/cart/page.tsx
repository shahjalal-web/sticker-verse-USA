"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import type { CartItem } from "@/lib/cart-types";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, total, itemCount, isHydrated, clearCart } = useCart();

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border border-white/[0.08] flex items-center justify-center"
            style={{ background: "radial-gradient(ellipse at center, rgba(80,60,200,0.08) 0%, transparent 70%)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-gray-600">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>

        <p
          className="text-[10px] tracking-[0.4em] uppercase text-gray-600 mb-3"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          Cart
        </p>
        <h1
          className="text-2xl md:text-3xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          Your bag is empty
        </h1>
        <p className="text-gray-500 mb-10 max-w-sm leading-relaxed text-sm">
          Looks like you haven&apos;t added anything yet. Explore our products and find something you love.
        </p>
        <Link
          href="/#categories"
          className="inline-flex items-center gap-2 text-xs font-bold px-10 py-4 tracking-[0.2em] uppercase hover:opacity-90 transition-all duration-200"
          style={{ fontFamily: "var(--font-orbitron)", background: "#ffffff", color: "#000000" }}
        >
          Shop Now →
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p
            className="text-[9px] tracking-[0.45em] uppercase text-gray-600 mb-2"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Checkout
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Your Cart
            <span className="ml-3 text-lg text-gray-600">({itemCount})</span>
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors duration-200 tracking-wide hidden sm:block"
        >
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} onRemove={removeItem} onUpdateQty={updateQty} />
          ))}
          <Link
            href="/#categories"
            className="mt-2 inline-flex items-center gap-2 text-xs text-gray-600 hover:text-white transition-colors duration-200"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div
            className="border border-white/[0.08] p-7 sticky top-24"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            {/* Gradient top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            <h2
              className="text-[11px] font-bold text-white tracking-[0.2em] uppercase mb-7"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Order Summary
            </h2>

            <div className="flex flex-col gap-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                <span className="text-white font-medium">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-400 text-xs font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxes</span>
                <span className="text-gray-500 text-xs">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-5 mb-7">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-white">Estimated Total</span>
                <span className="text-2xl font-bold text-white">{fmt(total)}</span>
              </div>
            </div>

            <button
              className="w-full text-xs font-bold py-4 tracking-[0.2em] uppercase hover:opacity-90 transition-all duration-200 mb-4"
              style={{ fontFamily: "var(--font-orbitron)", background: "#ffffff", color: "#000000" }}
              onClick={() => alert("Checkout flow coming soon!")}
            >
              Proceed to Checkout →
            </button>

            {/* Trust */}
            <div className="border-t border-white/[0.05] pt-5 flex flex-col gap-2.5 mt-2">
              {[
                "Secure SSL checkout",
                "Free shipping on orders over $50",
                "100% satisfaction guarantee",
              ].map((txt) => (
                <div key={txt} className="flex items-center gap-2.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[11px] text-gray-600">{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}) {
  const qty = item.kind === "product" ? item.qty : item.quantity;

  return (
    <div className="group relative flex gap-4 p-4 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
      style={{ background: "rgba(255,255,255,0.015)" }}>

      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-[88px] h-[88px] border border-white/[0.06] overflow-hidden bg-white/[0.02]">
        {item.thumbnail ? (
          <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-2" sizes="88px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white/[0.06]" style={{ fontFamily: "var(--font-orbitron)" }}>
              {item.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="min-w-0">
            <h3
              className="text-sm font-bold text-white truncate leading-snug"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {item.title}
            </h3>

            {/* Sticker details */}
            {item.kind === "vinyl-sticker" && (
              <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
                {[item.shape, item.material, item.size].filter(Boolean).join(" · ")}
              </p>
            )}

            {/* Product variant */}
            {item.kind === "product" && item.subtitle && (
              <p className="text-[10px] text-gray-500 mt-1 tracking-wide">{item.subtitle}</p>
            )}
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-700 hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Remove"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-1">
          {/* Qty control */}
          {item.kind === "product" ? (
            <div className="inline-flex border border-white/[0.1]">
              <button
                onClick={() => onUpdateQty(item.id, qty - 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-150 text-base"
              >
                −
              </button>
              <span className="w-9 h-8 flex items-center justify-center text-white text-xs font-medium border-x border-white/[0.1]">
                {qty}
              </span>
              <button
                onClick={() => onUpdateQty(item.id, qty + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-150 text-base"
              >
                +
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-gray-600">Qty: {qty}</span>
          )}

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-white">{fmt(item.totalPrice)}</p>
            {qty > 1 && (
              <p className="text-[10px] text-gray-600">{fmt(item.totalPrice / qty)} ea.</p>
            )}
          </div>
        </div>

        {/* Edit link */}
        {item.editHref && (
          <Link
            href={item.editHref}
            className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-gray-700 hover:text-gray-400 transition-colors duration-200 tracking-wide"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </Link>
        )}
      </div>
    </div>
  );
}
