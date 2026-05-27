"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import type { VinylStickerCartItem } from "@/lib/cart-types";
import type { ShopifyProduct } from "@/lib/shopify-products";

// ─── Pricing tiers ────────────────────────────────────────────────────────────

const QTY_TIERS = [
  { qty: 25, discount: 0 },
  { qty: 50, discount: 12 },
  { qty: 100, discount: 22 },
  { qty: 250, discount: 35 },
  { qty: 500, discount: 45 },
  { qty: 1000, discount: 55 },
] as const;

// ─── Shape / material / size options ─────────────────────────────────────────

type ShapeId = "die-cut" | "circle" | "oval" | "square" | "rectangle";
type MaterialId = "matte" | "gloss" | "holographic" | "chrome";
type SizeId = "2x2" | "3x3" | "4x4" | "5x5" | "custom";

const SHAPES: { id: ShapeId; label: string }[] = [
  { id: "die-cut", label: "Die Cut" },
  { id: "circle", label: "Circle" },
  { id: "oval", label: "Oval" },
  { id: "square", label: "Square" },
  { id: "rectangle", label: "Rectangle" },
];

const MATERIALS: { id: MaterialId; label: string; desc: string; style: React.CSSProperties }[] = [
  {
    id: "matte",
    label: "Matte Vinyl",
    desc: "No-glare finish",
    style: { background: "linear-gradient(135deg, #2c2c2e 0%, #3c3c3e 100%)" },
  },
  {
    id: "gloss",
    label: "Gloss Vinyl",
    desc: "Shiny & vibrant",
    style: { background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
  },
  {
    id: "holographic",
    label: "Holographic",
    desc: "Rainbow effect",
    style: {
      background:
        "linear-gradient(135deg, #ff6b9d 0%, #c44dff 20%, #4d79ff 40%, #00d4aa 60%, #ffd700 80%, #ff6b9d 100%)",
    },
  },
  {
    id: "chrome",
    label: "Silver Chrome",
    desc: "Metallic look",
    style: { background: "linear-gradient(135deg, #8e8e8e 0%, #d4d4d4 50%, #9a9a9a 100%)" },
  },
];

const SIZES: { id: SizeId; label: string; sub: string }[] = [
  { id: "2x2", label: "2\"", sub: "2×2 in" },
  { id: "3x3", label: "3\"", sub: "3×3 in" },
  { id: "4x4", label: "4\"", sub: "4×4 in" },
  { id: "5x5", label: "5\"", sub: "5×5 in" },
  { id: "custom", label: "Custom", sub: "Your size" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectDefaultMaterial(title: string): MaterialId {
  const t = title.toLowerCase();
  if (t.includes("holographic") || t.includes("holo")) return "holographic";
  if (t.includes("chrome") || t.includes("silver")) return "chrome";
  if (t.includes("gloss")) return "gloss";
  return "matte";
}

function fmt(amount: number, code = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─── Shape SVGs ───────────────────────────────────────────────────────────────

function ShapeIcon({ id, size = 28 }: { id: ShapeId; size?: number }) {
  const s = size;
  const sw = Math.max(1, size / 16);
  switch (id) {
    case "die-cut":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}>
          <path d="M4 2 L14 1 L22 6 L23 15 L18 22 L8 23 L1 17 L2 8 Z" strokeLinejoin="round" />
        </svg>
      );
    case "circle":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    case "oval":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}>
          <ellipse cx="12" cy="12" rx="7" ry="10" />
        </svg>
      );
    case "square":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}>
          <rect x="3" y="3" width="18" height="18" />
        </svg>
      );
    case "rectangle":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}>
          <rect x="2" y="6" width="20" height="12" />
        </svg>
      );
  }
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-[10px] font-bold text-gray-600 tracking-widest tabular-nums"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {num}
        </span>
        <div className="h-px flex-1 bg-white/5" />
        <h3
          className="text-[11px] font-semibold text-gray-400 tracking-[0.25em] uppercase"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StickerConfigurator({ product }: { product: ShopifyProduct }) {
  const [activeImg, setActiveImg] = useState(0);
  const [shape, setShape] = useState<ShapeId>("die-cut");
  const [material, setMaterial] = useState<MaterialId>(() => detectDefaultMaterial(product.title));
  const [sizeId, setSizeId] = useState<SizeId>("3x3");
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [selectedQty, setSelectedQty] = useState(50);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [added, setAdded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();

  const images =
    product.images.length > 0
      ? product.images
      : product.featuredImage
      ? [product.featuredImage]
      : [];

  // Pricing
  const baseVariant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const baseUnitPrice = baseVariant ? Number(baseVariant.price) : 2.0;
  const currencyCode = baseVariant?.currencyCode ?? "USD";

  function tierCalc(qty: number, discount: number) {
    const perUnit = Math.round(baseUnitPrice * (1 - discount / 100) * 100) / 100;
    const total = Math.round(perUnit * qty * 100) / 100;
    return { perUnit, total };
  }

  const activeTier = QTY_TIERS.find((t) => t.qty === selectedQty) ?? QTY_TIERS[1];
  const { perUnit: activePerUnit, total: activeTotal } = tierCalc(activeTier.qty, activeTier.discount);

  // File handling
  function handleFile(f: File) {
    setFile(f);
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  // Add to cart
  function handleAddToCart() {
    const sizeLabel =
      sizeId === "custom"
        ? `${customW || "?"}×${customH || "?"} in`
        : sizeId.replace("x", "×") + '"';

    const cartItem: Omit<VinylStickerCartItem, "id" | "addedAt"> = {
      kind: "vinyl-sticker",
      title: product.title,
      subtitle: `${MATERIALS.find((m) => m.id === material)?.label} · ${sizeLabel} · ${shape}`,
      thumbnail: product.featuredImage?.url ?? "",
      unitLabel: "stickers",
      totalPrice: activeTotal,
      quantity: activeTier.qty,
      shape,
      material,
      size: sizeId === "custom" ? "custom" : sizeId,
      customWidth: sizeId === "custom" && customW ? Number(customW) : undefined,
      customHeight: sizeId === "custom" && customH ? Number(customH) : undefined,
      roundedCorners: null,
      tierQty: activeTier.qty,
      perUnit: activePerUnit,
      fileName: file?.name,
      instructions: instructions || undefined,
    };
    addItem(cartItem);

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const canAddToCart = sizeId !== "custom" || (customW !== "" && customH !== "");

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

        {/* ── Left: Gallery ── */}
        <div className="lg:sticky lg:top-24 self-start">
          {/* Main image */}
          <div className="relative aspect-square overflow-hidden bg-white/[0.02] border border-white/5 mb-3">
            {images[activeImg] ? (
              <Image
                src={images[activeImg].url}
                alt={images[activeImg].altText ?? product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-7xl font-bold text-white/5"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {product.title.charAt(0)}
                </span>
              </div>
            )}
            {/* Material badge overlay */}
            <div className="absolute bottom-3 left-3">
              <span
                className="text-[9px] tracking-widest uppercase px-2 py-1 border border-white/10 bg-[#050508]/80 text-gray-400"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {MATERIALS.find((m) => m.id === material)?.label}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 relative w-14 h-14 border transition-colors overflow-hidden ${
                    i === activeImg
                      ? "border-white/50"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? ""}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          {product.descriptionHtml && (
            <div
              className="mt-6 text-sm text-gray-400 leading-relaxed prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>

        {/* ── Right: Configurator ── */}
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div>
            <p
              className="text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-1.5"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Customize
            </p>
            <h1
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {product.title}
            </h1>
            {baseUnitPrice > 0 && (
              <p className="text-gray-400 mt-1.5 text-sm">
                Starting from{" "}
                <span className="text-white font-medium">
                  {fmt(baseUnitPrice, currencyCode)}
                </span>{" "}
                / sticker
              </p>
            )}
          </div>

          {/* 01 — Shape */}
          <Section num="01" title="Choose Shape">
            <div className="grid grid-cols-5 gap-2">
              {SHAPES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  className={`flex flex-col items-center gap-2 py-3 px-1 border transition-all duration-200 ${
                    shape === s.id
                      ? "border-white bg-white/8 text-white"
                      : "border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300"
                  }`}
                >
                  <ShapeIcon id={s.id} size={24} />
                  <span
                    className="text-[9px] tracking-widest uppercase leading-tight text-center"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          {/* 02 — Material */}
          <Section num="02" title="Choose Material">
            <div className="grid grid-cols-2 gap-2">
              {MATERIALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMaterial(m.id)}
                  className={`flex items-center gap-3 p-3 border transition-all duration-200 text-left ${
                    material === m.id
                      ? "border-white bg-white/5"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded"
                    style={m.style}
                  />
                  <div>
                    <p
                      className={`text-xs font-semibold tracking-wide ${
                        material === m.id ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {m.label}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{m.desc}</p>
                  </div>
                  {material === m.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </Section>

          {/* 03 — Size */}
          <Section num="03" title="Choose Size">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSizeId(s.id)}
                  className={`flex flex-col items-center py-3 px-1 border transition-all duration-200 ${
                    sizeId === s.id
                      ? "border-white bg-white/8 text-white"
                      : "border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300"
                  }`}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {s.label}
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5">{s.sub}</span>
                </button>
              ))}
            </div>
            {sizeId === "custom" && (
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 mb-1.5 tracking-widest uppercase">
                    Width (in)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.25"
                    value={customW}
                    onChange={(e) => setCustomW(e.target.value)}
                    placeholder="e.g. 3.5"
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/30 placeholder:text-gray-600"
                  />
                </div>
                <span className="text-gray-500 pb-2.5">×</span>
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 mb-1.5 tracking-widest uppercase">
                    Height (in)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.25"
                    value={customH}
                    onChange={(e) => setCustomH(e.target.value)}
                    placeholder="e.g. 2.5"
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/30 placeholder:text-gray-600"
                  />
                </div>
              </div>
            )}
          </Section>

          {/* 04 — Quantity */}
          <Section num="04" title="Quantity &amp; Pricing">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {QTY_TIERS.map((tier) => {
                const { perUnit, total } = tierCalc(tier.qty, tier.discount);
                const active = selectedQty === tier.qty;
                return (
                  <button
                    key={tier.qty}
                    onClick={() => setSelectedQty(tier.qty)}
                    className={`flex flex-col items-center p-3 border transition-all duration-200 ${
                      active
                        ? "border-white bg-white/8 text-white"
                        : "border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300"
                    }`}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                      {tier.qty >= 1000 ? `${tier.qty / 1000}K` : tier.qty}
                    </span>
                    <span className="text-[9px] text-gray-500 mt-0.5">
                      {fmt(perUnit)}/ea
                    </span>
                    {tier.discount > 0 && (
                      <span
                        className={`text-[9px] mt-1 font-semibold ${
                          active ? "text-green-400" : "text-green-700"
                        }`}
                      >
                        -{tier.discount}%
                      </span>
                    )}
                    <span className={`text-[10px] mt-1 ${active ? "text-gray-300" : "text-gray-600"}`}>
                      {fmt(total)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* 05 — Upload */}
          <Section num="05" title="Upload Your Design">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed cursor-pointer transition-all duration-200 min-h-[140px] flex flex-col items-center justify-center gap-3 p-6 ${
                dragging
                  ? "border-white/50 bg-white/5"
                  : file
                  ? "border-white/20 bg-white/3"
                  : "border-white/10 hover:border-white/25 bg-white/[0.02]"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,application/pdf,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              {filePreview ? (
                <div className="relative w-24 h-24">
                  <Image
                    src={filePreview}
                    alt="Design preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  className="text-gray-600"
                >
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
                      Drop your file here or{" "}
                      <span className="text-white underline underline-offset-2">click to browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG · JPG · PDF · SVG &nbsp;·&nbsp; Max 25 MB
                    </p>
                  </>
                )}
              </div>
            </div>
            {file && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setFilePreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                × Remove file
              </button>
            )}
          </Section>

          {/* 06 — Instructions */}
          <Section num="06" title="Special Instructions (Optional)">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Specific color notes, finishing requests, or any special requirements…"
              className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/30 resize-none placeholder:text-gray-600 leading-relaxed"
            />
          </Section>

          {/* ── Price summary + CTA ── */}
          <div className="border border-white/10 bg-white/[0.02] p-5 sticky bottom-0 backdrop-blur-sm">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  {activeTier.qty} stickers ·{" "}
                  {MATERIALS.find((m) => m.id === material)?.label} ·{" "}
                  {sizeId === "custom"
                    ? `${customW || "?"}×${customH || "?"} in`
                    : sizeId.replace("x", "×") + '"'}
                </p>
                <p
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {fmt(activeTotal, currencyCode)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">per sticker</p>
                <p className="text-lg font-semibold text-gray-200">
                  {fmt(activePerUnit, currencyCode)}
                </p>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 ${
                added
                  ? "bg-green-600 text-white"
                  : canAddToCart
                  ? "bg-white text-black hover:bg-gray-100 active:scale-[0.99]"
                  : "bg-white/10 text-gray-600 cursor-not-allowed"
              }`}
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {added ? "✓ Added to Cart" : `Add to Cart →`}
            </button>

            {!canAddToCart && sizeId === "custom" && (
              <p className="text-[10px] text-gray-600 text-center mt-2">
                Enter custom dimensions above to continue
              </p>
            )}

            <p className="text-[10px] text-gray-600 text-center mt-3">
              Free shipping on orders over $50 &nbsp;·&nbsp; Ships in 3–5 business days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
