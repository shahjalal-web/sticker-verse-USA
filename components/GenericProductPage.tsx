"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import type { ProductCartItem } from "@/lib/cart-types";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify-products";
import PreflightModal, { type ProofResult, type ShapeId } from "./PreflightModal";

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
    const first = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
    if (first) {
      for (const opt of first.selectedOptions) defaults[opt.name] = opt.value;
    }
    return defaults;
  });
  const [qty, setQty] = useState(1);
  // Upload / preflight
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [preflightOpen, setPreflightOpen] = useState(false);
  const [proofResult, setProofResult] = useState<ProofResult | null>(null);
  const [changeNote, setChangeNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { addItem } = useCart();
  const router = useRouter();

  const images =
    product.images.length > 0
      ? product.images
      : product.featuredImage
      ? [product.featuredImage]
      : [];

  const activeVariant = findVariant(product.variants, selected);
  const displayImg = proofResult
    ? null
    : (activeVariant?.image ?? images[activeImg]);

  const unitPrice = activeVariant ? Number(activeVariant.price) : 0;
  const currencyCode = activeVariant?.currencyCode ?? "USD";
  const inStock = activeVariant ? activeVariant.availableForSale : false;

  const hasOptions =
    product.options.length > 0 &&
    !(product.options.length === 1 && product.options[0].values.length === 1);

  function handleFile(f: File) {
    setFile(f);
    setProofResult(null);
    if (f.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFilePreview(null);
    }
  }

  // Detect default shape based on product title
  function detectShape(): ShapeId {
    const t = product.title.toLowerCase();
    if (t.includes("circle") || t.includes("round")) return "circle";
    if (t.includes("oval")) return "oval";
    if (t.includes("square")) return "square";
    return "rectangle";
  }

  function handleAddToCart() {
    if (!activeVariant || !inStock) return;

    const extraProperties: Record<string, string> = {};
    if (file?.name)              extraProperties["Design File"]     = file.name;
    if (proofResult?.shopifyUrl) extraProperties["Design URL"]      = proofResult.shopifyUrl;
    if (proofResult?.shape)      extraProperties["Shape"]           = proofResult.shape;
    if (proofResult?.fitMode)    extraProperties["Fit Mode"]        = proofResult.fitMode;
    if (changeNote)              extraProperties["Change Request"]  = changeNote;

    const cartItem: Omit<ProductCartItem, "id" | "addedAt"> = {
      kind: "product",
      variantId: activeVariant.id,
      productTitle: product.title,
      title: product.title,
      subtitle: activeVariant.title !== "Default Title" ? activeVariant.title : "",
      thumbnail: proofResult?.designUrl ?? proofResult?.shopifyUrl ?? product.featuredImage?.url ?? "",
      unitLabel: "item",
      totalPrice: unitPrice * qty,
      quantity: qty,
      qty,
      unitPrice,
      selectedOptions: selected,
      editHref: `/products/${product.handle}`,
      extraProperties: Object.keys(extraProperties).length > 0 ? extraProperties : undefined,
    };
    addItem(cartItem);
    router.push("/cart");
  }

  return (
    <>
      {preflightOpen && file && (
        <PreflightModal
          file={file}
          initialShape={detectShape()}
          material={product.title}
          mode="simple"
          onApprove={(proof) => { setProofResult(proof); setChangeNote(""); setPreflightOpen(false); }}
          onClose={(note) => { setPreflightOpen(false); if (note) setChangeNote(note); }}
        />
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Left: Gallery ── */}
          <div className="lg:sticky lg:top-24 self-start">
            <div
              className="relative aspect-square overflow-hidden border border-white/5 mb-3 flex items-center justify-center"
              style={{ background: proofResult ? "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(0,30,10,0.4) 0%, #06060a 100%)" : "rgba(255,255,255,0.02)" }}
            >
              {proofResult ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proofResult.processedUrl}
                    alt="Approved design"
                    className="max-w-[80%] max-h-[80%] object-contain"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 border border-green-500/30 bg-green-500/10">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[8px] text-green-400 tracking-widest uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>
                      Proof OK
                    </span>
                  </div>
                </>
              ) : displayImg ? (
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

            {images.length > 1 && !proofResult && (
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

            {/* Upload Design */}
            <div>
              <p className="text-xs text-gray-400 tracking-widest uppercase mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>
                Upload Your Design
              </p>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 py-8 px-4 text-center transition-all duration-200 ${
                  dragging
                    ? "border-indigo-400/60 bg-indigo-500/[0.04]"
                    : file
                    ? "border-white/20 bg-white/[0.02]"
                    : "border-white/10 hover:border-white/25 bg-white/[0.015]"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
                {filePreview ? (
                  <div className="relative w-20 h-20">
                    <Image src={filePreview} alt="Design preview" fill className="object-contain" />
                  </div>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-gray-600">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                )}
                <div className="text-center">
                  {file ? (
                    <p className="text-sm text-white font-medium">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-300">
                        Drop your file or{" "}
                        <span className="text-white underline underline-offset-2">click to browse</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">PNG · JPG · PDF · SVG · Max 25 MB</p>
                    </>
                  )}
                </div>
              </div>

              {file && (
                <div className="mt-2.5 flex items-center gap-3 flex-wrap">
                  {proofResult && (
                    <div className="flex items-center gap-2 px-3 py-1.5 border border-green-500/30 bg-green-500/[0.04]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-[10px] text-green-400 tracking-wide" style={{ fontFamily: "var(--font-orbitron)" }}>
                        Proof Approved
                      </span>
                    </div>
                  )}
                  {changeNote && !proofResult && (
                    <div className="flex items-center gap-2 px-3 py-1.5 border border-yellow-500/30 bg-yellow-500/[0.04]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      <span className="text-[10px] text-yellow-400 tracking-wide" style={{ fontFamily: "var(--font-orbitron)" }}>
                        Change Noted
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setFilePreview(null);
                      setProofResult(null);
                      setChangeNote("");
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    × Remove file
                  </button>
                </div>
              )}
            </div>

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
              {proofResult ? (
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 ${
                    inStock
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-white/10 text-gray-600 cursor-not-allowed"
                  }`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {inStock ? "Add to Cart →" : "Out of Stock"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { if (file) setPreflightOpen(true); }}
                  disabled={!file}
                  className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                    file
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-white/10 text-gray-600 cursor-not-allowed"
                  }`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {file ? "View Proof →" : "Upload Design to Continue"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
