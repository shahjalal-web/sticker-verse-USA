"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import type { VinylStickerCartItem } from "@/lib/cart-types";
import type { ShopifyProduct } from "@/lib/shopify-products";
import PreflightModal, { type ProofResult, type ShapeId as PreflightShapeId } from "./PreflightModal";

// ─── Pricing tiers ────────────────────────────────────────────────────────────

const QTY_TIERS = [
  { qty: 50,   discount: 0  },
  { qty: 100,  discount: 22 },
  { qty: 200,  discount: 35 },
  { qty: 300,  discount: 45 },
  { qty: 500,  discount: 55 },
  { qty: 1000, discount: 65 },
  { qty: 3000, discount: 75 },
] as const;

// ─── Shape / material / size options ─────────────────────────────────────────

type CutType  = "die-cut" | "kiss-cut";
type ShapeId = "die-cut" | "circle" | "oval" | "square" | "rectangle";
type MaterialId = "matte" | "gloss" | "holographic" | "chrome";
type SizeId = "2x2" | "3x3" | "4x4" | "5x5" | "custom";

const SHAPES: { id: ShapeId; label: string }[] = [
  { id: "die-cut", label: "Custom Shape" },
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
  { id: "2x2",   label: "Small",   sub: "2\"" },
  { id: "3x3",   label: "Medium",  sub: "3\"" },
  { id: "4x4",   label: "Large",   sub: "4\"" },
  { id: "5x5",   label: "X-Large", sub: "5\"" },
  { id: "custom", label: "Custom",  sub: "Your size" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectDefaultMaterial(title: string): MaterialId {
  const t = title.toLowerCase();
  if (t.includes("holographic") || t.includes("holo")) return "holographic";
  if (t.includes("chrome") || t.includes("silver")) return "chrome";
  if (t.includes("gloss")) return "gloss";
  return "matte";
}

function getAvailableMaterials(title: string): MaterialId[] {
  const t = title.toLowerCase();
  if (t.includes("holographic") || t.includes("holo")) return ["holographic"];
  if (t.includes("chrome") || t.includes("silver")) return ["chrome"];
  // All other products (vinyl, kiss cut, clear, sticker sheets, etc.) → matte + gloss only
  return ["matte", "gloss"];
}

interface DealInfo {
  isDeal: boolean;
  dealQty: number | null;
  dealSize: SizeId | null;
}

function detectDealInfo(title: string): DealInfo {
  // Match titles like "150 3" Custom Die Cut Stickers" → qty=150, size=3"
  const match = title.match(/^(\d+)\s+(\d+(?:\.\d+)?)["""]/);
  if (match) {
    const qty = parseInt(match[1]);
    const sizeMap: Record<string, SizeId> = { "2": "2x2", "3": "3x3", "4": "4x4", "5": "5x5" };
    return { isDeal: true, dealQty: qty, dealSize: sizeMap[match[2]] ?? null };
  }
  if (title.toLowerCase().includes("deal") || title.toLowerCase().includes("bundle")) {
    return { isDeal: true, dealQty: null, dealSize: null };
  }
  return { isDeal: false, dealQty: null, dealSize: null };
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
        <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={Math.max(1.5, s / 12)} strokeLinejoin="round">
          <path d="M20,4 L24.1,14.3 L35.2,15.1 L26.7,22.2 L29.4,32.9 L20,27 L10.6,32.9 L13.3,22.2 L4.8,15.1 L15.9,14.3 Z" />
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
  const dealInfo = detectDealInfo(product.title);

  const [activeImg, setActiveImg] = useState(0);
  const [cutType, setCutType] = useState<CutType>("die-cut");
  const [shape, setShape] = useState<ShapeId>("die-cut");
  const [material, setMaterial] = useState<MaterialId>(() => detectDefaultMaterial(product.title));
  const [sizeId, setSizeId] = useState<SizeId>(dealInfo.dealSize ?? "3x3");
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [selectedQty, setSelectedQty] = useState(dealInfo.dealQty ?? 100);
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  const [preflightOpen, setPreflightOpen] = useState(false);
  const [proofResult, setProofResult] = useState<ProofResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();
  const router = useRouter();
  const availableMaterials = MATERIALS.filter((m) => getAvailableMaterials(product.title).includes(m.id));

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

  const activeTier = QTY_TIERS.find((t) => t.qty === selectedQty) ?? QTY_TIERS[0];
  // For deals, Shopify price IS the total bundle price, not per-sticker
  const dealTotal = dealInfo.isDeal && dealInfo.dealQty ? baseUnitPrice : null;
  const dealPerUnit = dealInfo.isDeal && dealInfo.dealQty
    ? Math.round((baseUnitPrice / dealInfo.dealQty) * 100) / 100
    : null;
  const { perUnit: tierPerUnit, total: tierTotal } = tierCalc(activeTier.qty, activeTier.discount);
  const activePerUnit = dealPerUnit ?? tierPerUnit;
  const activeTotal   = dealTotal   ?? tierTotal;

  // File handling
  function handleFile(f: File) {
    setFile(f);
    setProofResult(null);
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
      thumbnail: proofResult?.designUrl ?? proofResult?.shopifyUrl ?? product.featuredImage?.url ?? "",
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
      fileUrl: proofResult?.designUrl ?? proofResult?.shopifyUrl ?? undefined,
      instructions: instructions || undefined,
      proof: proofResult
        ? {
            status: "approved" as const,
            proofUrl: proofResult.shopifyUrl ?? undefined,
            cutlineUrl: proofResult.shopifyUrl ?? undefined,
            designUrl: proofResult.designUrl ?? undefined,
            cutFileUrl: proofResult.cutFileUrl ?? undefined,
            productionPdfUrl: proofResult.productionPdfUrl ?? undefined,
            shape: proofResult.shape,
            fitMode: proofResult.fitMode,
            borderThickness: proofResult.borderThickness,
            roundedCorners: proofResult.roundedCorners,
            removedBackground: proofResult.removedBackground,
            lowResolution: false,
          }
        : undefined,
    };
    addItem(cartItem);
    router.push("/cart");
  }

  const canAddToCart = sizeId !== "custom" || (customW !== "" && customH !== "");

  return (
    <>
    {preflightOpen && file && (
      <PreflightModal
        file={file}
        initialShape={shape as PreflightShapeId}
        material={material}
        widthIn={sizeId === "custom" ? (Number(customW) || undefined) : Number(sizeId.split("x")[0])}
        heightIn={sizeId === "custom" ? (Number(customH) || undefined) : Number(sizeId.split("x")[1])}
        onApprove={(proof) => {
          setProofResult(proof);
          setShape(proof.shape as ShapeId);
          setPreflightOpen(false);
        }}
        onClose={(note) => {
          setPreflightOpen(false);
          if (note) setInstructions((prev) => prev ? `${prev}\n\nChange Request: ${note}` : `Change Request: ${note}`);
        }}
      />
    )}
    <div className="max-w-350 mx-auto px-4 sm:px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

        {/* ── Left: Gallery ── */}
        <div className="lg:sticky lg:top-24 self-start">
          {/* Main image */}
          <div
            className="relative aspect-square overflow-hidden border border-white/5 mb-3 flex items-center justify-center"
            style={{ background: proofResult ? "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(0,30,10,0.4) 0%, #06060a 100%)" : "rgba(255,255,255,0.02)" }}
          >
            {/* Proof image (approved design) */}
            {proofResult ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={proofResult.processedUrl}
                alt="Approved proof"
                className="max-w-[80%] max-h-[80%] object-contain"
                style={(() => {
                  const d = proofResult.borderThickness === "thin" ? 2 : proofResult.borderThickness === "normal" ? 4 : 8;
                  const c = proofResult.cutlineColor ?? "#ffffff";
                  const d2 = Math.round(d * 0.71);
                  const d3 = Math.round(d * 0.4);
                  return {
                    filter: [
                      `drop-shadow(${d}px 0 0 ${c})`, `drop-shadow(-${d}px 0 0 ${c})`,
                      `drop-shadow(0 ${d}px 0 ${c})`, `drop-shadow(0 -${d}px 0 ${c})`,
                      `drop-shadow(${d2}px ${d2}px 0 ${c})`, `drop-shadow(-${d2}px -${d2}px 0 ${c})`,
                      `drop-shadow(${d2}px -${d2}px 0 ${c})`, `drop-shadow(-${d2}px ${d2}px 0 ${c})`,
                      `drop-shadow(${d}px ${d3}px 0 ${c})`, `drop-shadow(-${d}px ${d3}px 0 ${c})`,
                      `drop-shadow(${d}px -${d3}px 0 ${c})`, `drop-shadow(-${d}px -${d3}px 0 ${c})`,
                      `drop-shadow(${d3}px ${d}px 0 ${c})`, `drop-shadow(-${d3}px ${d}px 0 ${c})`,
                      `drop-shadow(${d3}px -${d}px 0 ${c})`, `drop-shadow(-${d3}px -${d}px 0 ${c})`,
                    ].join(" "),
                  };
                })()}
              />
            ) : images[activeImg] ? (
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

            {/* Proof approved badge */}
            {proofResult && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 border border-green-500/30 bg-green-500/10">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[8px] text-green-400 tracking-widest uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Proof OK
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
                  className={`shrink-0 relative w-14 h-14 border transition-colors overflow-hidden ${
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
                {dealInfo.isDeal && dealInfo.dealQty ? (
                  <>
                    Deal price:{" "}
                    <span className="text-white font-medium">{fmt(baseUnitPrice, currencyCode)}</span>
                    {" "}·{" "}
                    <span className="text-white font-medium">
                      {fmt(Math.round(baseUnitPrice / dealInfo.dealQty * 100) / 100, currencyCode)}
                    </span>
                    {" "}/ sticker
                  </>
                ) : (
                  <>
                    Starting from{" "}
                    <span className="text-white font-medium">{fmt(baseUnitPrice, currencyCode)}</span>
                    {" "}/ sticker
                  </>
                )}
              </p>
            )}
          </div>

          {/* 01 — Cut Type */}
          <Section num="01" title="Select a Cut Type">
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "die-cut"  as CutType, label: "Contour Cut",   desc: "Cut through the backing — sticker follows your artwork's exact shape." },
                { id: "kiss-cut" as CutType, label: "Kiss Cut",  desc: "Surface layer only — sticker sits on a square backing sheet." },
              ].map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => setCutType(ct.id)}
                  className={`flex flex-col items-start gap-1.5 p-4 border text-left transition-all duration-200 ${
                    cutType === ct.id
                      ? "border-white bg-white/6 text-white"
                      : "border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300"
                  }`}
                >
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {ct.label}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-relaxed">{ct.desc}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* 02 — Shape */}
          <Section num="02" title="Choose Shape">
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

          {/* 03 — Material */}
          <Section num="03" title="Choose Material">
            <div className="grid grid-cols-2 gap-2">
              {availableMaterials.map((m) => (
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
                    className="shrink-0 w-8 h-8 rounded"
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
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </Section>

          {/* 04 — Size */}
          <Section num="04" title="Choose Size">
            {dealInfo.isDeal && dealInfo.dealSize ? (
              <div className="flex items-center gap-3 px-4 py-3 border border-white/10 bg-white/2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {SIZES.find((s) => s.id === dealInfo.dealSize)?.label ?? ""} — {SIZES.find((s) => s.id === dealInfo.dealSize)?.sub ?? ""}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Size is fixed for this deal</p>
                </div>
              </div>
            ) : (
            <>
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
            </>
            )}
          </Section>

          {/* 05 — Quantity */}
          <Section num="05" title="Quantity &amp; Pricing">
            {dealInfo.isDeal && dealInfo.dealQty ? (
              <div className="flex items-center gap-3 px-4 py-3 border border-white/10 bg-white/2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                <div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {dealInfo.dealQty} Stickers — Deal Price
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Quantity is fixed for this deal</p>
                </div>
              </div>
            ) : (
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
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

          {/* Hidden file input — triggered by bottom CTA */}
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

          {/* ── Price summary + CTA ── */}
          <div className="border border-white/10 bg-white/2 p-5 sticky bottom-0 backdrop-blur-sm">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  {dealInfo.dealQty ?? activeTier.qty} stickers ·{" "}
                  {MATERIALS.find((m) => m.id === material)?.label} ·{" "}
                  {dealInfo.dealSize
                    ? (SIZES.find((s) => s.id === dealInfo.dealSize)?.sub ?? "")
                    : sizeId === "custom"
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

            {/* File status row */}
            {file && !proofResult && (
              <div className="flex items-center gap-3 mb-3 px-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400 shrink-0">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
                </svg>
                <span className="text-xs text-gray-300 truncate flex-1">{file.name}</span>
                <button
                  type="button"
                  onClick={() => { setFile(null); setProofResult(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors shrink-0"
                >
                  × Remove
                </button>
              </div>
            )}
            {proofResult && (
              <div className="flex items-center gap-2 mb-3 px-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[10px] text-green-400 tracking-wide" style={{ fontFamily: "var(--font-orbitron)" }}>Proof Approved</span>
                <button
                  type="button"
                  onClick={() => { setFile(null); setProofResult(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors ml-auto"
                >
                  × Change
                </button>
              </div>
            )}

            {proofResult ? (
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 ${
                  canAddToCart
                    ? "bg-white text-black hover:bg-gray-100 active:scale-[0.99]"
                    : "bg-white/10 text-gray-600 cursor-not-allowed"
                }`}
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Add to Cart →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (file && canAddToCart) setPreflightOpen(true);
                  else if (!file) fileRef.current?.click();
                }}
                disabled={!!file && !canAddToCart}
                className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                  file && canAddToCart
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.99]"
                    : !file
                    ? "bg-indigo-600/80 text-white hover:bg-indigo-600 active:scale-[0.99]"
                    : "bg-white/10 text-gray-600 cursor-not-allowed"
                }`}
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {file ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    View Proof →
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
                    </svg>
                    Upload Design to Continue
                  </>
                )}
              </button>
            )}

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
    </>
  );
}
