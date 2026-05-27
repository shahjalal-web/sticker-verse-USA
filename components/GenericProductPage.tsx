"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import type { ProductCartItem } from "@/lib/cart-types";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify-products";

function fmt(amount: number, code = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(amount);
}

function findVariant(variants: ShopifyVariant[], selected: Record<string, string>): ShopifyVariant | null {
  return (
    variants.find((v) =>
      v.selectedOptions.every((opt) => selected[opt.name] === opt.value),
    ) ?? null
  );
}

export default function GenericProductPage({ product }: { product: ShopifyProduct }) {
  const [activeImg, setActiveImg] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    const first =
      product.variants.find((v) => v.availableForSale) ?? product.variants[0];
    if (first) {
      for (const opt of first.selectedOptions) {
        defaults[opt.name] = opt.value;
      }
    }
    return defaults;
  });
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const images =
    product.images.length > 0
      ? product.images
      : product.featuredImage
      ? [product.featuredImage]
      : [];

  const activeVariant = findVariant(product.variants, selected);
  const displayImg = activeVariant?.image ?? images[activeImg];

  const unitPrice = activeVariant ? Number(activeVariant.price) : 0;
  const currencyCode = activeVariant?.currencyCode ?? "USD";
  const inStock = activeVariant ? activeVariant.availableForSale : false;

  const hasOptions =
    product.options.length > 0 &&
    !(product.options.length === 1 && product.options[0].values.length === 1);

  function handleAddToCart() {
    if (!activeVariant || !inStock) return;
    const cartItem: Omit<ProductCartItem, "id" | "addedAt"> = {
      kind: "product",
      variantId: activeVariant.id,
      productTitle: product.title,
      title: product.title,
      subtitle: activeVariant.title !== "Default Title" ? activeVariant.title : "",
      thumbnail: product.featuredImage?.url ?? "",
      unitLabel: "item",
      totalPrice: unitPrice * qty,
      quantity: qty,
      qty,
      unitPrice,
      selectedOptions: selected,
      editHref: `/products/${product.handle}`,
    };
    addItem(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

        {/* ── Left: Gallery ── */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="relative aspect-square overflow-hidden bg-white/[0.02] border border-white/5 mb-3">
            {displayImg ? (
              <Image
                src={displayImg.url}
                alt={displayImg.altText ?? product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-bold text-white/5" style={{ fontFamily: "var(--font-orbitron)" }}>
                  {product.title.charAt(0)}
                </span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 relative w-14 h-14 border transition-colors overflow-hidden ${
                    i === activeImg ? "border-white/50" : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <Image src={img.url} alt={img.altText ?? ""} fill sizes="56px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
          {product.descriptionHtml && (
            <div
              className="mt-6 text-sm text-gray-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>

        {/* ── Right: Product info ── */}
        <div className="flex flex-col gap-7">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>
              {product.title}
            </h1>
            {unitPrice > 0 && (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-white">
                  {fmt(unitPrice * qty, currencyCode)}
                </span>
                {activeVariant?.compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {fmt(Number(activeVariant.compareAtPrice), currencyCode)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Options */}
          {hasOptions && (
            <div className="flex flex-col gap-5">
              {product.options.map((opt) => (
                <div key={opt.id}>
                  <p className="text-xs text-gray-400 tracking-widest uppercase mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {opt.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {opt.values.map((val) => {
                      const isActive = selected[opt.name] === val;
                      const testSelected = { ...selected, [opt.name]: val };
                      const testVariant = findVariant(product.variants, testSelected);
                      const available = testVariant ? testVariant.availableForSale : false;
                      return (
                        <button
                          key={val}
                          onClick={() => setSelected((prev) => ({ ...prev, [opt.name]: val }))}
                          disabled={!available}
                          className={`px-4 py-2 text-xs border transition-all duration-200 ${
                            isActive
                              ? "border-white bg-white text-black font-semibold"
                              : available
                              ? "border-white/15 text-gray-300 hover:border-white/35 hover:text-white"
                              : "border-white/5 text-gray-600 cursor-not-allowed line-through"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>
              Quantity
            </p>
            <div className="inline-flex border border-white/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-lg"
              >
                −
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-white text-sm font-medium border-x border-white/15">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 ${
                added
                  ? "bg-green-600 text-white"
                  : inStock
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-white/10 text-gray-600 cursor-not-allowed"
              }`}
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {added ? "✓ Added to Cart" : inStock ? "Add to Cart →" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
