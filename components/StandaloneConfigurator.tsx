"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import type { VinylStickerCartItem } from "@/lib/cart-types";
import PreflightModal, { type ProofResult, type ShapeId as PreflightShapeId } from "./PreflightModal";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StickerType = "vinyl" | "holographic" | "glitter" | "chrome" | "sheets";
type CutType    = "die-cut" | "kiss-cut";
type ShapeId    = "custom" | "circle" | "oval" | "square" | "rectangle";
type MaterialId = "matte" | "gloss" | "holographic" | "chrome" | "glitter";
type SizeId     = "2x2" | "3x3" | "4x4" | "5x5" | "4x2" | "6x4" | "7x5" | "11x8.5" | "custom";

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<StickerType, {
  title: string; subtitle: string; description: string;
  materials: MaterialId[]; defaultMaterial: MaterialId;
  basePrice: number; accent: string; accentRgb: string; features: string[];
}> = {
  vinyl: {
    title: "Vinyl Stickers", subtitle: "Vibrant, Durable, Professional.",
    description: "Premium vinyl stickers perfect for laptops, water bottles, and outdoor use — waterproof, scratch-resistant, and dishwasher safe.",
    materials: ["matte", "gloss"], defaultMaterial: "matte", basePrice: 2.00,
    accent: "#6366f1", accentRgb: "99,102,241",
    features: ["Waterproof", "UV Resistant", "Scratch-Proof", "Dishwasher Safe"],
  },
  holographic: {
    title: "Holographic Stickers", subtitle: "Rainbow shimmer effect that turns heads.",
    description: "Holographic vinyl stickers with a stunning rainbow effect. Waterproof and UV-resistant.",
    materials: ["matte", "gloss"], defaultMaterial: "matte", basePrice: 2.50,
    accent: "#a855f7", accentRgb: "168,85,247",
    features: ["Rainbow Shimmer", "Waterproof", "UV Resistant", "Eye-Catching"],
  },
  glitter: {
    title: "Glitter Stickers", subtitle: "Sparkle and shine on every surface.",
    description: "Eye-catching glitter vinyl stickers. Durable, waterproof, and packed with sparkle.",
    materials: ["matte", "gloss"], defaultMaterial: "matte", basePrice: 2.75,
    accent: "#eab308", accentRgb: "234,179,8",
    features: ["Glitter Finish", "Waterproof", "Durable", "Sparkle Effect"],
  },
  chrome: {
    title: "Chrome Stickers", subtitle: "Mirror-like metallic finish. Bold and striking.",
    description: "Chrome mirror vinyl stickers with a sleek metallic look. Weather-resistant and long-lasting.",
    materials: ["matte", "gloss"], defaultMaterial: "matte", basePrice: 2.50,
    accent: "#94a3b8", accentRgb: "148,163,184",
    features: ["Mirror Finish", "Weather-Resistant", "Long-Lasting", "Metallic"],
  },
  sheets: {
    title: "Sticker Sheets", subtitle: "Multiple designs on a single sheet.",
    description: "Custom sticker sheets — perfect for variety packs, product packaging, and brand kits.",
    materials: ["matte", "gloss"], defaultMaterial: "matte", basePrice: 5.00,
    accent: "#22c55e", accentRgb: "34,197,94",
    features: ["Multi-Design", "Brand Kits", "Easy Peel", "Variety Packs"],
  },
};

// ─── Pricing ──────────────────────────────────────────────────────────────────

const BASE_QTYS = [50, 100, 200, 300, 500, 1000, 3000] as const;

// Sheets — fixed lookup for standard sizes [perUnit, total, savings%]
const SHEETS_PRICING: Partial<Record<string, readonly [number, number, number][]>> = {
  "4x2":    [[1.33,66.50,0],[0.86,86.45,35],[0.61,122.36,54],[0.52,155.61,61],[0.43,212.80,68],[0.35,345.80,74],[0.23,678.30,83]],
  "6x4":    [[1.87,93.50,0],[1.40,140.25,25],[1.12,224.40,40],[0.99,297.33,47],[0.88,439.45,53],[0.75,748.00,60],[0.58,1739.10,69]],
  "7x5":    [[2.22,111.00,0],[1.67,166.50,25],[1.33,266.40,40],[1.18,352.98,47],[1.04,521.70,53],[0.89,888.00,60],[0.69,2064.60,69]],
  "11x8.5": [[3.78,189.00,0],[3.10,309.96,18],[2.65,529.20,30],[2.42,725.76,36],[2.15,1077.30,43],[1.89,1890.00,50],[1.78,5329.80,53]],
};

// Sheets — totals by size/qty for custom-size interpolation
const SHEETS_PRICE_TABLE: Record<string, Record<number, number>> = {
  "4x2":    { 50: 66.50, 100: 86.45, 200: 122.36, 300: 155.61, 500: 212.80, 1000: 345.80, 3000: 678.30 },
  "6x4":    { 50: 93.50, 100: 140.25, 200: 224.40, 300: 297.33, 500: 439.45, 1000: 748.00, 3000: 1739.10 },
  "7x5":    { 50: 111.00, 100: 166.50, 200: 266.40, 300: 352.98, 500: 521.70, 1000: 888.00, 3000: 2064.60 },
  "11x8.5": { 50: 189.00, 100: 309.96, 200: 529.20, 300: 725.76, 500: 1077.30, 1000: 1890.00, 3000: 5329.80 },
};

const SHEETS_SIZE_PROFILES: Record<string, { width: number; height: number }> = {
  "4x2":    { width: 4,  height: 2   },
  "6x4":    { width: 6,  height: 4   },
  "7x5":    { width: 7,  height: 5   },
  "11x8.5": { width: 11, height: 8.5 },
};

// ─── Sticker Pricing Engine v2 ────────────────────────────────────────────────
// Base price table (white vinyl, all sizes, key breakpoint quantities)
const PRICE_TABLE: Record<string, Record<number, number>> = {
  "2x2": { 15: 17.55, 50: 58.50, 100: 76.05, 200: 107.64, 300: 136.64, 500: 187.20, 1000: 304.20, 3000: 596.70 },
  "3x3": { 15: 20.25, 50: 68.50, 100: 87.75, 200: 124.20, 300: 157.95, 500: 216.00, 1000: 351.00, 3000: 688.50 },
  "4x4": { 15: 24.30, 50: 81.00, 100: 113.40, 200: 171.72, 300: 223.56, 500: 315.90, 1000: 534.60, 3000: 1117.80 },
  "5x5": { 15: 28.65, 50: 95.50, 100: 143.25, 200: 229.20, 300: 303.69, 500: 448.85, 1000: 764.00, 3000: 1776.30 },
};

const SIZE_PROFILES: Record<string, { width: number; height: number }> = {
  "2x2": { width: 2, height: 2 },
  "3x3": { width: 3, height: 3 },
  "4x4": { width: 4, height: 4 },
  "5x5": { width: 5, height: 5 },
};

// Material multipliers (applied on top of base white-vinyl price)
const MATERIAL_MULTIPLIERS: Record<string, number> = {
  whiteVinyl:  1.0000,
  glitter:     1.1396,
  holographic: 1.2536,
  chrome:      1.2536,
};

// Minimum per-unit price floors — price never drops below these regardless of quantity
const PRICE_FLOORS: Record<string, Record<string, number>> = {
  whiteVinyl:  { "2x2": 0.15, "3x3": 0.18, "4x4": 0.29, "5x5": 0.50 },
  glitter:     { "2x2": 0.17, "3x3": 0.20, "4x4": 0.34, "5x5": 0.57 },
  holographic: { "2x2": 0.19, "3x3": 0.22, "4x4": 0.37, "5x5": 0.63 },
  chrome:      { "2x2": 0.19, "3x3": 0.22, "4x4": 0.37, "5x5": 0.63 },
};

function _lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function _clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function _getBounds(value: number, list: number[]): [number, number] {
  if (value <= list[0]) return [list[0], list[0]];
  if (value >= list[list.length - 1]) return [list[list.length - 1], list[list.length - 1]];
  for (let i = 0; i < list.length - 1; i++) {
    if (value >= list[i] && value <= list[i + 1]) return [list[i], list[i + 1]];
  }
  return [list[0], list[0]];
}

function _interpolateQty(sizeKey: string, quantity: number): number {
  const table = PRICE_TABLE[sizeKey];
  const qtys = Object.keys(table).map(Number).sort((a, b) => a - b);
  const [q1, q2] = _getBounds(quantity, qtys);
  const t = q1 === q2 ? 0 : (quantity - q1) / (q2 - q1);
  return _lerp(table[q1], table[q2], t);
}

function _sizeScore(w: number, h: number) {
  return Math.min(w, h) * 0.65 + Math.max(w, h) * 0.35;
}

function _interpolateSheetQty(sizeKey: string, quantity: number): number {
  const table = SHEETS_PRICE_TABLE[sizeKey];
  const qtys = Object.keys(table).map(Number).sort((a, b) => a - b);
  const [q1, q2] = _getBounds(quantity, qtys);
  const t = q1 === q2 ? 0 : (quantity - q1) / (q2 - q1);
  return _lerp(table[q1], table[q2], t);
}

function calcSheetPrice(width: number, height: number, quantity: number): number {
  const scored = Object.keys(SHEETS_SIZE_PROFILES)
    .map(k => ({ k, score: _sizeScore(SHEETS_SIZE_PROFILES[k].width, SHEETS_SIZE_PROFILES[k].height) }))
    .sort((a, b) => a.score - b.score);

  const targetScore = _sizeScore(width, height);
  const scoreList = scored.map(s => s.score);
  const [s1, s2] = _getBounds(targetScore, scoreList);

  const lower = scored.find(s => s.score === s1)!;
  const upper = scored.find(s => s.score === s2)!;
  const sizeT = s1 === s2 ? 0 : (targetScore - s1) / (s2 - s1);

  let price = _lerp(_interpolateSheetQty(lower.k, quantity), _interpolateSheetQty(upper.k, quantity), sizeT);

  const areaFactor = _clamp(Math.sqrt((width * height) / (targetScore * targetScore)), 0.90, 1.25);
  price *= areaFactor;

  return Number(price.toFixed(2));
}

// Interpolate the floor per-unit price for any custom size using the same size-score approach
function getFloorPerUnit(width: number, height: number, matKey: string): number {
  const floors = PRICE_FLOORS[matKey] ?? PRICE_FLOORS.whiteVinyl;
  const scored = Object.keys(SIZE_PROFILES)
    .map(k => ({ k, score: _sizeScore(SIZE_PROFILES[k].width, SIZE_PROFILES[k].height) }))
    .sort((a, b) => a.score - b.score);

  const targetScore = _sizeScore(width, height);
  const scoreList = scored.map(s => s.score);
  const [s1, s2] = _getBounds(targetScore, scoreList);

  const lower = scored.find(s => s.score === s1)!;
  const upper = scored.find(s => s.score === s2)!;
  const t = s1 === s2 ? 0 : (targetScore - s1) / (s2 - s1);

  return _lerp(floors[lower.k], floors[upper.k], t);
}

function calcStickerPrice(width: number, height: number, quantity: number, matKey: string): number {
  const scored = Object.keys(SIZE_PROFILES)
    .map(k => ({ k, score: _sizeScore(SIZE_PROFILES[k].width, SIZE_PROFILES[k].height) }))
    .sort((a, b) => a.score - b.score);

  const targetScore = _sizeScore(width, height);
  const scoreList = scored.map(s => s.score);
  const [s1, s2] = _getBounds(targetScore, scoreList);

  const lower = scored.find(s => s.score === s1)!;
  const upper = scored.find(s => s.score === s2)!;
  const sizeT = s1 === s2 ? 0 : (targetScore - s1) / (s2 - s1);

  let price = _lerp(_interpolateQty(lower.k, quantity), _interpolateQty(upper.k, quantity), sizeT);

  // Area protection: long/narrow stickers price higher than score-only would suggest
  const areaFactor = _clamp(Math.sqrt((width * height) / (targetScore * targetScore)), 0.90, 1.25);
  price *= areaFactor;

  price *= (MATERIAL_MULTIPLIERS[matKey] ?? 1.0);
  return Number(price.toFixed(2));
}

const TYPE_HERO_IMG: Record<StickerType, string> = {
  vinyl:       "/Vinyl Stickers.png",
  holographic: "/Holographic Stickers.png",
  glitter:     "/Glitter Stickers.png",
  chrome:      "/Chrome Stickers.png",
  sheets:      "/Sticker Sheets.png",
};

// ─── Option data ──────────────────────────────────────────────────────────────

const ALL_MATERIALS: { id: MaterialId; label: string; desc: string; style: React.CSSProperties; badge?: string }[] = [
  { id: "matte",        label: "Matte",        desc: "Smooth, non-reflective finish",  style: { background: "linear-gradient(160deg,#e8e8e8 0%,#c8c8c8 100%)" } },
  { id: "gloss",        label: "Gloss",        desc: "Shiny, vibrant colors",          style: { background: "linear-gradient(160deg,#f8f8f8 0%,#d0d8e8 50%,#b8c8d8 100%)" } },
  { id: "holographic",  label: "Holographic",  desc: "Stunning rainbow shimmer",       style: { background: "linear-gradient(135deg,#ff6b9d 0%,#c44dff 25%,#4d79ff 50%,#00d4aa 75%,#ffd700 100%)" } },
  { id: "chrome",       label: "Chrome",       desc: "Mirror-like metallic look",      style: { background: "linear-gradient(135deg,#c0c0c0 0%,#f8f8f8 40%,#a8a8a8 70%,#e8e8e8 100%)" } },
  { id: "glitter",      label: "Glitter",      desc: "Eye-catching sparkle",           style: { background: "linear-gradient(135deg,#ffd700 0%,#ff69b4 40%,#da70d6 70%,#ffd700 100%)" } },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StandaloneConfigurator({ stickerType }: { stickerType: StickerType }) {
  const config = TYPE_CONFIG[stickerType];
  const availableMaterials = ALL_MATERIALS.filter((m) => (config.materials as string[]).includes(m.id));
  const { accent, accentRgb } = config;

  const [cutType, setCutType]           = useState<CutType>("die-cut");
  const [shape, setShape]               = useState<ShapeId>("custom");
  const [material, setMaterial]         = useState<MaterialId>(config.defaultMaterial);
  const [sizeId, setSizeId]             = useState<SizeId>(stickerType === "sheets" ? "4x2" : "3x3");
  const [customW, setCustomW]           = useState("");
  const [customH, setCustomH]           = useState("");
  const [selectedTierQty, setSelectedTierQty] = useState<number | "custom">(100);
  const [customQtyInput, setCustomQtyInput]   = useState("");
  const [file, setFile]                 = useState<File | null>(null);
  const [filePreview, setFilePreview]   = useState<string | null>(null);
  const [dragging, setDragging]         = useState(false);
  const [instructions, setInstructions] = useState("");
  const [preflightOpen, setPreflightOpen] = useState(false);
  const [proofResult, setProofResult]   = useState<ProofResult | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();
  const router = useRouter();

  const activeQty = selectedTierQty === "custom"
    ? (parseInt(customQtyInput) || 0)
    : selectedTierQty;

  function getPrice(qty: number): { perUnit: number; total: number; savings: number } {
    if (qty <= 0) return { perUnit: 0, total: 0, savings: 0 };

    // Sheets
    if (stickerType === "sheets") {
      const glossMult = 1.0;

      if (sizeId === "custom") {
        const w = parseFloat(customW);
        const h = parseFloat(customH);
        if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) return { perUnit: 0, total: 0, savings: 0 };
        const total = Math.round(calcSheetPrice(w, h, qty) * glossMult * 100) / 100;
        const perUnit = Math.round((total / qty) * 100) / 100;
        const base50PerUnit = Math.round(calcSheetPrice(w, h, 50) * glossMult * 100) / 100 / 50;
        const savings = qty > 50 ? Math.max(0, Math.round((1 - perUnit / base50PerUnit) * 100)) : 0;
        return { perUnit, total, savings };
      }

      const tiers = SHEETS_PRICING[sizeId];
      if (!tiers) return { perUnit: 0, total: 0, savings: 0 };
      // Sheets have fixed qty breakpoints independent of BASE_QTYS
      const SHEET_QTY_BREAKS = [50, 100, 200, 300, 500, 1000, 3000];
      let idx = 0;
      for (let i = 0; i < SHEET_QTY_BREAKS.length; i++) {
        if (SHEET_QTY_BREAKS[i] <= qty) idx = i; else break;
      }
      const [pu, exactTotal, sav] = tiers[idx];
      const rawTotal = SHEET_QTY_BREAKS[idx] === qty ? exactTotal : Math.round(pu * qty * 100) / 100;
      const total = Math.round(rawTotal * glossMult * 100) / 100;
      const perUnit = Math.round((total / qty) * 100) / 100;
      return { perUnit, total, savings: sav };
    }

    // Stickers: get dimensions (standard or custom)
    let w: number, h: number;
    if (sizeId === "custom") {
      w = parseFloat(customW);
      h = parseFloat(customH);
      if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) return { perUnit: 0, total: 0, savings: 0 };
    } else {
      const parts = sizeId.match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/);
      if (!parts) return { perUnit: 0, total: 0, savings: 0 };
      w = parseFloat(parts[1]);
      h = parseFloat(parts[2]);
    }

    // Map sticker type → material key; gloss adds 5% on any finish
    const matKey = stickerType === "holographic" ? "holographic"
      : stickerType === "chrome" ? "chrome"
      : stickerType === "glitter" ? "glitter"
      : "whiteVinyl";
    const glossMult = 1.0;

    // Floor per-unit — price never drops below this regardless of quantity
    const floorPerUnit = getFloorPerUnit(w, h, matKey) * glossMult;

    const rawPerUnit = calcStickerPrice(w, h, qty, matKey) * glossMult / qty;
    const effectivePerUnit = Math.max(rawPerUnit, floorPerUnit);
    const total = Math.round(effectivePerUnit * qty * 100) / 100;
    const perUnit = Math.round((total / qty) * 100) / 100;

    // Savings vs buying 15 units (minimum qty)
    const raw15PerUnit = calcStickerPrice(w, h, 15, matKey) * glossMult / 15;
    const effective15PerUnit = Math.max(raw15PerUnit, floorPerUnit);
    const savings = qty > 15 ? Math.max(0, Math.round((1 - effectivePerUnit / effective15PerUnit) * 100)) : 0;

    return { perUnit, total, savings };
  }

  const { perUnit: activePerUnit, total: activeTotal, savings: activeDiscount } = getPrice(activeQty);

  function handleFile(f: File) {
    setFile(f);
    setProofResult(null);
    if (f.type.startsWith("image/")) setFilePreview(URL.createObjectURL(f));
    else setFilePreview(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleAddToCart() {
    const sizeLabel = sizeId === "custom" ? `${customW || "?"}×${customH || "?"} in` : sizeId.replace("x", "×") + '"';
    const materialLabel = ALL_MATERIALS.find((m) => m.id === material)?.label ?? material;
    const cartItem: Omit<VinylStickerCartItem, "id" | "addedAt"> = {
      kind: "vinyl-sticker",
      cutType,
      title: config.title,
      subtitle: `${materialLabel} · ${cutType} · ${sizeLabel} · Qty ${activeQty}`,
      thumbnail: proofResult?.designUrl ?? proofResult?.shopifyUrl ?? "", unitLabel: "stickers", totalPrice: activeTotal, quantity: activeQty,
      shape, material,
      size: sizeId === "custom" ? "custom" : sizeId,
      customWidth:  sizeId === "custom" && customW ? Number(customW) : undefined,
      customHeight: sizeId === "custom" && customH ? Number(customH) : undefined,
      roundedCorners: null, tierQty: activeQty, perUnit: activePerUnit,
      fileName: file?.name,
      fileUrl: proofResult?.designUrl ?? proofResult?.shopifyUrl ?? undefined,
      instructions: instructions || undefined,
      proof: proofResult
        ? {
            status: "approved" as const,
            proofUrl:          proofResult.shopifyUrl ?? undefined,
            cutlineUrl:        proofResult.shopifyUrl ?? undefined,
            designUrl:         proofResult.designUrl  ?? undefined,
            cutFileUrl:        proofResult.cutFileUrl ?? undefined,
            productionPdfUrl:  proofResult.productionPdfUrl ?? undefined,
            shape:             proofResult.shape,
            fitMode:           proofResult.fitMode,
            borderThickness:   proofResult.borderThickness,
            roundedCorners:    proofResult.roundedCorners,
            removedBackground: proofResult.removedBackground,
            lowResolution: false,
            cutlineColor: proofResult.cutlineColor,
            bgColor: proofResult.bgColor,
          }
        : undefined,
    };
    addItem(cartItem);
    router.push("/cart");
  }

  const canProceed = (sizeId !== "custom" || (customW !== "" && customH !== ""))
    && (selectedTierQty !== "custom" || (customQtyInput !== "" && parseInt(customQtyInput) >= 15));

  const shapeToPreflightId: Record<ShapeId, PreflightShapeId> = {
    custom: "die-cut", circle: "circle", oval: "oval", square: "square", rectangle: "rectangle",
  };

  const activeMaterialStyle = ALL_MATERIALS.find((m) => m.id === material)?.style ?? {};

  return (
    <>
      <style>{`
        @keyframes sc-float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes sc-shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        @keyframes sc-shine {
          0% { left: -80%; }
          100% { left: 130%; }
        }
        @keyframes sc-orb1 {
          0%,100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes sc-orb2 {
          0%,100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(15px) scale(0.95); }
        }
        .sc-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .sc-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .sc-opt {
          position: relative; overflow: hidden;
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
        }
        .sc-opt::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-150%) skewX(-20deg);
          pointer-events: none;
        }
        .sc-opt:hover::before { animation: sc-shimmer 0.55s ease forwards; }
        .sc-opt > * { position: relative; z-index: 1; }
        .sc-upload-icon { animation: sc-float 3s ease-in-out infinite; }
        .sc-cta-active::after {
          content: '';
          position: absolute; top: 0; bottom: 0; width: 35%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: sc-shine 2.8s ease-in-out infinite;
          pointer-events: none;
        }
        .sc-input:focus {
          outline: none;
          border-color: rgba(var(--ac), 0.55) !important;
          box-shadow: 0 0 0 3px rgba(var(--ac), 0.12);
        }
        .sc-textarea:focus {
          outline: none;
          border-color: rgba(var(--ac), 0.4) !important;
        }
      `}</style>

      {preflightOpen && file && (
        <PreflightModal
          file={file}
          initialShape={shapeToPreflightId[shape]}
          material={material}
          widthIn={sizeId === "custom" ? (parseFloat(customW) || undefined) : parseFloat(sizeId.match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/)?.[1] ?? "") || undefined}
          heightIn={sizeId === "custom" ? (parseFloat(customH) || undefined) : parseFloat(sizeId.match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/)?.[2] ?? "") || undefined}
          onApprove={(proof) => { setProofResult(proof); setPreflightOpen(false); }}
          onClose={(note) => {
            setPreflightOpen(false);
            if (note) setInstructions((p) => p ? `${p}\n\nChange Request: ${note}` : `Change Request: ${note}`);
          }}
        />
      )}

      {/* Root — sets --ac CSS variable for use in .sc-input:focus etc. */}
      <div
        className="min-h-screen pb-28 overflow-x-hidden"
        style={{ background: "#040410", "--ac": accentRgb } as React.CSSProperties}
      >
        <div className="max-w-400 mx-auto px-4">

          {/* ── Hero ── */}
          <div
            className="mt-6 rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg,#0c0c2e 0%,#131050 45%,#0c0c2a 100%)",
              border: `1px solid rgba(${accentRgb},0.18)`,
              minHeight: "210px",
            }}
          >
            {/* Orb 1 */}
            <div style={{
              position: "absolute", top: "-55%", right: "-4%",
              width: "520px", height: "520px", borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${accentRgb},0.13) 0%, transparent 65%)`,
              animation: "sc-orb1 9s ease-in-out infinite",
              pointerEvents: "none",
            }} />
            {/* Orb 2 */}
            <div style={{
              position: "absolute", bottom: "-55%", left: "12%",
              width: "380px", height: "380px", borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${accentRgb},0.08) 0%, transparent 65%)`,
              animation: "sc-orb2 12s ease-in-out infinite",
              pointerEvents: "none",
            }} />
            {/* Grid overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }} />

            <div className="relative z-10 flex items-center justify-between gap-8 px-8 py-8">
              <div className="flex-1 min-w-0">
                <p style={{
                  fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase",
                  fontFamily: "var(--font-orbitron)", color: `rgba(${accentRgb},0.75)`,
                  marginBottom: "0.5rem",
                }}>Custom Stickers</p>

                <h1 style={{
                  fontFamily: "var(--font-orbitron)", fontWeight: 900,
                  fontSize: "clamp(1.75rem,3.5vw,2.75rem)", lineHeight: 1.1, marginBottom: "0.55rem",
                  background: `linear-gradient(135deg,#fff 0%,rgba(${accentRgb},1) 55%,rgba(${accentRgb},0.65) 100%)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {config.title}
                </h1>

                <p style={{ color: `rgba(${accentRgb},0.85)`, fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.7rem" }}>
                  {config.subtitle}
                </p>

                <p className="hidden sm:block" style={{ color: "rgba(200,210,255,0.5)", fontSize: "0.75rem", lineHeight: 1.75, maxWidth: "500px", marginBottom: "1.1rem" }}>
                  {config.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {config.features.map((f) => (
                    <span key={f} style={{
                      fontSize: "9px", fontFamily: "var(--font-orbitron)", letterSpacing: "0.12em",
                      textTransform: "uppercase", padding: "5px 12px", borderRadius: "100px",
                      border: `1px solid rgba(${accentRgb},0.3)`,
                      background: `rgba(${accentRgb},0.1)`,
                      color: `rgba(${accentRgb},0.95)`,
                    }}>{f}</span>
                  ))}
                </div>
              </div>

              {/* Hero product image */}
              <div className="hidden md:flex flex-col items-center gap-3 shrink-0" style={{ animation: "sc-float 4s ease-in-out infinite" }}>
                <div style={{
                  width: "130px", height: "130px", borderRadius: "20px", overflow: "hidden", position: "relative",
                  border: `1px solid rgba(${accentRgb},0.3)`,
                  boxShadow: `0 0 32px rgba(${accentRgb},0.35),0 0 72px rgba(${accentRgb},0.12)`,
                }}>
                  <Image
                    src={TYPE_HERO_IMG[stickerType]}
                    alt={config.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── 4-step grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">

            {/* ── 01 Shape ── */}
            <div className="sc-card rounded-[20px] p-5 flex flex-col gap-3.5 relative overflow-hidden"
              style={{ background: "linear-gradient(145deg,#08082a 0%,#0c0c32 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{
                position: "absolute", top: "-8px", right: "14px",
                fontSize: "76px", fontFamily: "var(--font-orbitron)", fontWeight: 900,
                color: "rgba(255,255,255,0.025)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
              }}>01</div>

              <div className="flex items-center gap-2.5 relative">
                <div style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  background: `rgba(${accentRgb},0.14)`, border: `1px solid rgba(${accentRgb},0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2">
                    <path d="M12 2C6.5 2 3 6.5 3 11c0 5.5 4 10 9 11 5-1 9-5.5 9-11 0-4.5-3.5-9-9-9z"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>
                  Select a Shape
                </h2>
              </div>

              {/* Die-cut / Kiss-cut sliding toggle */}
              <div style={{
                position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr",
                background: "#07071e", borderRadius: "12px", padding: "4px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{
                  position: "absolute", top: "4px", bottom: "4px",
                  left: cutType === "die-cut" ? "4px" : "calc(50% + 2px)",
                  width: "calc(50% - 6px)",
                  background: `linear-gradient(135deg,${accent}cc,${accent})`,
                  borderRadius: "8px",
                  transition: "left 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                  boxShadow: `0 0 14px rgba(${accentRgb},0.4)`,
                }} />
                {([
                  { id: "die-cut"  as CutType, label: "Contour Cut",  sub: "Shape-cut" },
                  { id: "kiss-cut" as CutType, label: "Kiss Cut", sub: "On backing" },
                ]).map((ct) => (
                  <button key={ct.id} onClick={() => setCutType(ct.id)}
                    style={{
                      position: "relative", zIndex: 1, padding: "8px 4px", borderRadius: "8px",
                      cursor: "pointer", border: "none", background: "transparent", textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-orbitron)", color: cutType === ct.id ? "white" : "rgba(255,255,255,0.32)", transition: "color 0.2s" }}>
                      {ct.label}
                    </div>
                    <div style={{ fontSize: "8px", marginTop: "2px", color: cutType === ct.id ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.18)", transition: "color 0.2s" }}>
                      {ct.sub}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom shape featured */}
              <button className="sc-opt" onClick={() => setShape("custom")} style={{
                borderRadius: "14px", padding: "13px 14px", cursor: "pointer",
                border: `1px solid ${shape === "custom" ? `rgba(${accentRgb},0.55)` : "rgba(255,255,255,0.07)"}`,
                background: shape === "custom" ? `rgba(${accentRgb},0.1)` : "rgba(255,255,255,0.03)",
                boxShadow: shape === "custom" ? `0 0 22px rgba(${accentRgb},0.22),inset 0 0 20px rgba(${accentRgb},0.05)` : "none",
                display: "flex", alignItems: "center", gap: "12px", width: "100%", textAlign: "left",
              }}>
                <svg viewBox="0 0 40 40" style={{ width: "34px", height: "34px", flexShrink: 0 }} fill="none">
                  <path
                    d="M20,4 L24.1,14.3 L35.2,15.1 L26.7,22.2 L29.4,32.9 L20,27 L10.6,32.9 L13.3,22.2 L4.8,15.1 L15.9,14.3 Z"
                    fill={shape === "custom" ? `rgba(${accentRgb},0.18)` : "rgba(255,255,255,0.04)"}
                    stroke={shape === "custom" ? accent : "#4b5563"}
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20,9.5 L22.8,17.5 L31.3,18.1 L25.1,23.5 L27.1,31.8 L20,27.5 L12.9,31.8 L14.9,23.5 L8.7,18.1 L17.2,17.5 Z"
                    fill="none"
                    stroke={shape === "custom" ? `rgba(${accentRgb},0.4)` : "rgba(255,255,255,0.08)"}
                    strokeWidth="1"
                    strokeDasharray="2.5 2.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "white" }}>Custom Shape</p>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.38)", marginTop: "2px" }}>Cut to your artwork outline</p>
                </div>
                {shape === "custom" && (
                  <div style={{
                    marginLeft: "auto", width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                    background: accent, display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 8px rgba(${accentRgb},0.7)`,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>

              {/* 4 shapes grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {([
                  { id: "circle" as ShapeId, label: "Circle",
                    icon: (sel: boolean) => (
                      <svg viewBox="0 0 56 56" style={{ width: "48px", height: "48px" }}>
                        <circle cx="28" cy="28" r="22" fill={sel ? `rgba(${accentRgb},0.2)` : "rgba(255,255,255,0.04)"} stroke={sel ? accent : "rgba(255,255,255,0.22)"} strokeWidth="2"/>
                        <circle cx="28" cy="28" r="15" fill="none" stroke={sel ? `rgba(${accentRgb},0.4)` : "rgba(255,255,255,0.08)"} strokeWidth="1" strokeDasharray="3 3"/>
                      </svg>
                    )},
                  { id: "oval" as ShapeId, label: "Oval",
                    icon: (sel: boolean) => (
                      <svg viewBox="0 0 56 56" style={{ width: "48px", height: "48px" }}>
                        <ellipse cx="28" cy="28" rx="16" ry="22" fill={sel ? `rgba(${accentRgb},0.2)` : "rgba(255,255,255,0.04)"} stroke={sel ? accent : "rgba(255,255,255,0.22)"} strokeWidth="2"/>
                        <ellipse cx="28" cy="28" rx="10" ry="15" fill="none" stroke={sel ? `rgba(${accentRgb},0.4)` : "rgba(255,255,255,0.08)"} strokeWidth="1" strokeDasharray="3 3"/>
                      </svg>
                    )},
                  { id: "square" as ShapeId, label: "Square",
                    icon: (sel: boolean) => (
                      <svg viewBox="0 0 56 56" style={{ width: "48px", height: "48px" }}>
                        <rect x="6" y="6" width="44" height="44" rx="4" fill={sel ? `rgba(${accentRgb},0.2)` : "rgba(255,255,255,0.04)"} stroke={sel ? accent : "rgba(255,255,255,0.22)"} strokeWidth="2"/>
                        <rect x="14" y="14" width="28" height="28" rx="2" fill="none" stroke={sel ? `rgba(${accentRgb},0.4)` : "rgba(255,255,255,0.08)"} strokeWidth="1" strokeDasharray="3 3"/>
                      </svg>
                    )},
                  { id: "rectangle" as ShapeId, label: "Rectangle",
                    icon: (sel: boolean) => (
                      <svg viewBox="0 0 56 56" style={{ width: "48px", height: "48px" }}>
                        <rect x="4" y="13" width="48" height="30" rx="4" fill={sel ? `rgba(${accentRgb},0.2)` : "rgba(255,255,255,0.04)"} stroke={sel ? accent : "rgba(255,255,255,0.22)"} strokeWidth="2"/>
                        <rect x="11" y="20" width="34" height="16" rx="2" fill="none" stroke={sel ? `rgba(${accentRgb},0.4)` : "rgba(255,255,255,0.08)"} strokeWidth="1" strokeDasharray="3 3"/>
                      </svg>
                    )},
                ]).map((s) => {
                  const sel = shape === s.id;
                  return (
                    <button key={s.id} className="sc-opt" onClick={() => setShape(s.id)} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                      padding: "10px 6px", borderRadius: "12px", cursor: "pointer",
                      border: `1px solid ${sel ? `rgba(${accentRgb},0.55)` : "rgba(255,255,255,0.07)"}`,
                      background: sel ? `rgba(${accentRgb},0.1)` : "rgba(255,255,255,0.03)",
                      boxShadow: sel ? `0 0 16px rgba(${accentRgb},0.2)` : "none",
                    }}>
                      {s.icon(sel)}
                      <span style={{ fontSize: "9px", fontWeight: 600, fontFamily: "var(--font-orbitron)", letterSpacing: "0.08em", color: sel ? accent : "rgba(255,255,255,0.38)" }}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 02 Material ── */}
            <div className="sc-card rounded-[20px] p-5 flex flex-col gap-3 relative overflow-hidden"
              style={{ background: "linear-gradient(145deg,#08082a 0%,#0c0c32 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{
                position: "absolute", top: "-8px", right: "14px",
                fontSize: "76px", fontFamily: "var(--font-orbitron)", fontWeight: 900,
                color: "rgba(255,255,255,0.025)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
              }}>02</div>

              <div className="flex items-center gap-2.5 relative">
                <div style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  background: `rgba(${accentRgb},0.14)`, border: `1px solid rgba(${accentRgb},0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>
                  Material
                </h2>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                {availableMaterials.map((m) => {
                  const sel = material === m.id;
                  return (
                    <button key={m.id} className="sc-opt" onClick={() => setMaterial(m.id)} style={{
                      borderRadius: "14px", cursor: "pointer", width: "100%", textAlign: "left",
                      border: `2px solid ${sel ? accent : "rgba(255,255,255,0.07)"}`,
                      background: sel ? `rgba(${accentRgb},0.08)` : "rgba(255,255,255,0.02)",
                      boxShadow: sel ? `0 0 22px rgba(${accentRgb},0.3)` : "none",
                      overflow: "hidden", padding: 0,
                    }}>
                      {/* Full-width swatch banner */}
                      <div style={{
                        height: "52px", width: "100%",
                        ...m.style,
                        borderBottom: `1px solid ${sel ? `rgba(${accentRgb},0.3)` : "rgba(255,255,255,0.06)"}`,
                        position: "relative",
                      }}>
                        {/* shine sweep on swatch */}
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)",
                          pointerEvents: "none",
                        }} />
                        {sel && (
                          <div style={{
                            position: "absolute", top: "6px", right: "8px",
                            width: "20px", height: "20px", borderRadius: "50%",
                            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                      </div>
                      {/* label row */}
                      <div style={{ padding: "9px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "white" }}>{m.label}</p>
                          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)", marginTop: "1px" }}>{m.desc}</p>
                        </div>
                        {m.badge && (
                          <span style={{
                            fontSize: "8px", fontWeight: 700, padding: "3px 9px", borderRadius: "100px",
                            fontFamily: "var(--font-orbitron)",
                            background: sel ? `rgba(${accentRgb},0.25)` : "rgba(255,255,255,0.08)",
                            color: sel ? accent : "rgba(255,255,255,0.5)",
                          }}>{m.badge}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 03 Size ── */}
            <div className="sc-card rounded-[20px] p-5 flex flex-col gap-3 relative overflow-hidden"
              style={{ background: "linear-gradient(145deg,#08082a 0%,#0c0c32 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{
                position: "absolute", top: "-8px", right: "14px",
                fontSize: "76px", fontFamily: "var(--font-orbitron)", fontWeight: 900,
                color: "rgba(255,255,255,0.025)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
              }}>03</div>

              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-2.5">
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "10px",
                    background: `rgba(${accentRgb},0.14)`, border: `1px solid rgba(${accentRgb},0.3)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2">
                      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                      <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>
                    Select a Size
                  </h2>
                </div>
                <span style={{ fontSize: "9px", color: accent, textDecoration: "underline", cursor: "pointer", fontFamily: "var(--font-orbitron)", letterSpacing: "0.08em" }}>
                  Size guide
                </span>
              </div>

              {stickerType === "sheets" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {([
                    { id: "4x2"    as SizeId, label: '4"×2"',   sub: "Small Sheet" },
                    { id: "6x4"    as SizeId, label: '6"×4"',   sub: "Medium Sheet" },
                    { id: "7x5"    as SizeId, label: '7"×5"',   sub: "Large Sheet" },
                    { id: "11x8.5" as SizeId, label: '11"×8.5"',sub: "XL Sheet" },
                  ]).map((s) => (
                    <button key={s.id} className="sc-opt" onClick={() => setSizeId(s.id)} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                      padding: "12px 8px", borderRadius: "14px", cursor: "pointer",
                      border: `1px solid ${sizeId === s.id ? `rgba(${accentRgb},0.55)` : "rgba(255,255,255,0.07)"}`,
                      background: sizeId === s.id ? `rgba(${accentRgb},0.1)` : "rgba(255,255,255,0.03)",
                      boxShadow: sizeId === s.id ? `0 0 18px rgba(${accentRgb},0.2)` : "none",
                    }}>
                      <svg viewBox="0 0 60 40" style={{ width: "52px", height: "34px" }}>
                        <rect x="3" y="3" width="54" height="34" rx="3"
                          fill={sizeId === s.id ? `rgba(${accentRgb},0.15)` : "rgba(255,255,255,0.04)"}
                          stroke={sizeId === s.id ? accent : "rgba(255,255,255,0.18)"} strokeWidth="1.5"/>
                      </svg>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-orbitron)", color: sizeId === s.id ? "white" : "rgba(255,255,255,0.45)" }}>{s.label}</p>
                        <p style={{ fontSize: "8px", marginTop: "1px", color: sizeId === s.id ? accent : "rgba(255,255,255,0.28)" }}>{s.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {([
                    { id: "2x2" as SizeId, label: "Small",   sub: '2"×2"', img: "/2 inch Stickers.png" },
                    { id: "3x3" as SizeId, label: "Medium",  sub: '3"×3"', img: "/3 inch stickers.png" },
                    { id: "4x4" as SizeId, label: "Large",   sub: '4"×4"', img: "/4 inch stickers.png" },
                    { id: "5x5" as SizeId, label: "X-Large", sub: '5"×5"', img: "/5 inch stickers.png" },
                  ]).map((s) => (
                    <button key={s.id} className="sc-opt" onClick={() => setSizeId(s.id)} style={{
                      position: "relative", overflow: "hidden",
                      height: "96px", cursor: "pointer", padding: 0,
                      borderRadius: "14px",
                      border: `2px solid ${sizeId === s.id ? accent : "rgba(255,255,255,0.07)"}`,
                      boxShadow: sizeId === s.id ? `0 0 20px rgba(${accentRgb},0.45)` : "none",
                    }}>
                      <Image src={s.img} alt={s.label} fill className="object-cover" unoptimized />
                      {/* gradient overlay */}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: sizeId === s.id
                          ? `linear-gradient(to top, rgba(${accentRgb},0.88) 0%, rgba(0,0,0,0.25) 65%)`
                          : "linear-gradient(to top, rgba(2,2,20,0.92) 0%, rgba(0,0,0,0.35) 65%)",
                        transition: "background 0.25s ease",
                      }} />
                      {/* checkmark */}
                      {sizeId === s.id && (
                        <div style={{
                          position: "absolute", top: "7px", right: "7px",
                          width: "18px", height: "18px", borderRadius: "50%",
                          background: "white", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      )}
                      {/* text */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "7px 9px", textAlign: "left" }}>
                        <p style={{ fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-orbitron)", color: "white", lineHeight: 1.2 }}>{s.label}</p>
                        <p style={{ fontSize: "8px", marginTop: "2px", color: sizeId === s.id ? `rgba(255,255,255,0.9)` : "rgba(255,255,255,0.5)" }}>{s.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button className="sc-opt" onClick={() => setSizeId("custom")} style={{
                width: "100%", padding: "10px", borderRadius: "12px", cursor: "pointer",
                border: `1px solid ${sizeId === "custom" ? `rgba(${accentRgb},0.55)` : "rgba(255,255,255,0.07)"}`,
                background: sizeId === "custom" ? `rgba(${accentRgb},0.1)` : "rgba(255,255,255,0.03)",
                boxShadow: sizeId === "custom" ? `0 0 16px rgba(${accentRgb},0.2)` : "none",
                fontSize: "11px", fontWeight: 600, fontFamily: "var(--font-orbitron)", letterSpacing: "0.08em",
                color: sizeId === "custom" ? "white" : "rgba(255,255,255,0.38)",
              }}>
                Custom Size
              </button>

              {sizeId === "custom" && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="number" min="0.5" max="24" step="0.25"
                    value={customW} onChange={(e) => setCustomW(e.target.value)}
                    placeholder="W (in)"
                    className="sc-input"
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "white", fontSize: "13px", padding: "8px 12px", borderRadius: "10px",
                    }}
                  />
                  <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "14px" }}>×</span>
                  <input
                    type="number" min="0.5" max="24" step="0.25"
                    value={customH} onChange={(e) => setCustomH(e.target.value)}
                    placeholder="H (in)"
                    className="sc-input"
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "white", fontSize: "13px", padding: "8px 12px", borderRadius: "10px",
                    }}
                  />
                </div>
              )}
            </div>

            {/* ── 04 Quantity ── */}
            <div className="sc-card rounded-[20px] p-5 flex flex-col gap-2 relative overflow-hidden"
              style={{ background: "linear-gradient(145deg,#08082a 0%,#0c0c32 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{
                position: "absolute", top: "-8px", right: "14px",
                fontSize: "76px", fontFamily: "var(--font-orbitron)", fontWeight: 900,
                color: "rgba(255,255,255,0.025)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
              }}>04</div>

              <div className="flex items-center gap-2.5 relative">
                <div style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  background: `rgba(${accentRgb},0.14)`, border: `1px solid rgba(${accentRgb},0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-orbitron)", fontSize: "13px", fontWeight: 900, color: accent,
                }}>#</div>
                <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>
                  Quantity
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
                {BASE_QTYS.map((qty) => {
                  const { perUnit: pu, total: tot, savings: sav } = getPrice(qty);
                  const active = selectedTierQty === qty;
                  return (
                    <button key={qty} className="sc-opt" onClick={() => setSelectedTierQty(qty)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 12px", borderRadius: "10px", cursor: "pointer",
                      border: `1px solid ${active ? `rgba(${accentRgb},0.5)` : "transparent"}`,
                      background: active ? `rgba(${accentRgb},0.14)` : "transparent",
                      boxShadow: active ? `0 0 16px rgba(${accentRgb},0.2)` : "none",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-orbitron)", fontSize: "11px", fontWeight: 700,
                        color: active ? "white" : "rgba(255,255,255,0.55)",
                      }}>
                        {qty >= 1000 ? `${qty / 1000}k` : qty}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <span style={{ fontSize: "10px", color: active ? `rgba(${accentRgb},0.7)` : "rgba(255,255,255,0.3)", marginRight: "2px" }}>
                          {pu > 0 ? `${fmt(pu)} ea` : ""}
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: active ? "white" : "rgba(255,255,255,0.7)" }}>
                          {tot > 0 ? fmt(tot) : "—"}
                        </span>
                        {sav > 0 && (
                          <span style={{
                            fontSize: "8px", fontWeight: 700, padding: "2px 7px", borderRadius: "100px",
                            fontFamily: "var(--font-orbitron)",
                            background: active ? `rgba(${accentRgb},0.3)` : "rgba(34,197,94,0.14)",
                            color: active ? accent : "#22c55e",
                          }}>
                            -{sav}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Custom quantity row */}
                <button className="sc-opt" onClick={() => setSelectedTierQty("custom")} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "9px 12px", borderRadius: "10px", cursor: "pointer",
                  border: `1px solid ${selectedTierQty === "custom" ? `rgba(${accentRgb},0.5)` : "rgba(255,255,255,0.06)"}`,
                  background: selectedTierQty === "custom" ? `rgba(${accentRgb},0.14)` : "rgba(255,255,255,0.02)",
                  boxShadow: selectedTierQty === "custom" ? `0 0 16px rgba(${accentRgb},0.2)` : "none",
                }}>
                  <span style={{
                    fontFamily: "var(--font-orbitron)", fontSize: "11px", fontWeight: 700,
                    color: selectedTierQty === "custom" ? "white" : "rgba(255,255,255,0.45)",
                  }}>Custom</span>
                  <span style={{ fontSize: "9px", color: selectedTierQty === "custom" ? accent : "rgba(255,255,255,0.28)", fontFamily: "var(--font-orbitron)" }}>
                    Enter qty →
                  </span>
                </button>

                {selectedTierQty === "custom" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <input
                      type="number" min="15" max="50000" step="1"
                      value={customQtyInput}
                      onChange={(e) => setCustomQtyInput(e.target.value)}
                      placeholder="Enter quantity (min 15)"
                      className="sc-input"
                      style={{
                        flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                        color: "white", fontSize: "13px", padding: "9px 12px", borderRadius: "10px",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Total card */}
              <div style={{
                marginTop: "6px", borderRadius: "14px", padding: "14px 16px",
                background: `linear-gradient(135deg,rgba(${accentRgb},0.2) 0%,rgba(${accentRgb},0.1) 100%)`,
                border: `1px solid rgba(${accentRgb},0.28)`,
                boxShadow: `0 0 22px rgba(${accentRgb},0.14)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: activeDiscount > 0 ? "8px" : "0" }}>
                  <div>
                    <p style={{ fontSize: "8px", fontFamily: "var(--font-orbitron)", color: `rgba(${accentRgb},0.65)`, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "3px" }}>Total</p>
                    <p style={{ fontFamily: "var(--font-orbitron)", fontSize: "1.125rem", fontWeight: 900, color: "white" }}>
                      {activeTotal > 0 ? fmt(activeTotal) : sizeId === "custom" ? "Enter size" : "—"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "8px", fontFamily: "var(--font-orbitron)", color: `rgba(${accentRgb},0.65)`, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "3px" }}>Per unit</p>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: `rgba(${accentRgb},0.9)` }}>
                      {activePerUnit > 0 ? fmt(activePerUnit) : "—"}
                    </p>
                  </div>
                </div>
                {activeDiscount > 0 && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "5px 10px", borderRadius: "8px",
                    background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: "9px", fontFamily: "var(--font-orbitron)", color: "#22c55e", fontWeight: 700 }}>
                      You save {activeDiscount}% vs buying 15
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── Upload ── */}
          <div style={{ marginTop: "1rem" }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                borderRadius: "20px",
                border: `2px dashed ${dragging ? accent : proofResult ? "#22c55e" : file ? `rgba(${accentRgb},0.4)` : "rgba(255,255,255,0.11)"}`,
                background: dragging ? `rgba(${accentRgb},0.07)` : proofResult ? "rgba(34,197,94,0.04)" : file ? `rgba(${accentRgb},0.04)` : "#06061a",
                boxShadow: dragging ? `0 0 32px rgba(${accentRgb},0.22)` : "none",
                cursor: "pointer", minHeight: "160px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "16px", padding: "2.5rem",
                transition: "all 0.25s ease",
              }}
            >
              <input
                ref={fileRef} type="file"
                accept="image/png,image/jpeg,application/pdf,image/svg+xml"
                style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />

              {proofResult ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  {filePreview && <Image src={filePreview} alt="Approved proof" width={96} height={96} className="max-h-24 object-contain" />}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#22c55e", fontFamily: "var(--font-orbitron)", letterSpacing: "0.06em" }}>
                      Proof Approved
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "rgba(34,197,94,0.65)" }}>Ready to add to cart</p>
                </div>
              ) : filePreview ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div style={{ position: "relative", width: "96px", height: "96px" }}>
                    <Image src={filePreview} alt="Design preview" fill className="object-contain" />
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>{file?.name}</p>
                  <p style={{ fontSize: "11px", color: `rgba(${accentRgb},0.7)` }}>Click &quot;View Proof&quot; below to continue →</p>
                </div>
              ) : (
                <>
                  <div className="sc-upload-icon" style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: `rgba(${accentRgb},0.1)`, border: `1px solid rgba(${accentRgb},0.2)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" x2="12" y1="3" y2="15"/>
                    </svg>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "white", marginBottom: "6px" }}>Drag or click to upload your file</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)" }}>PNG, JPG, SVG, PDF · Max 25 MB · 1 file per order</p>
                  </div>
                </>
              )}
            </div>

            {file && (
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setFilePreview(null); setProofResult(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="hover:text-white transition-colors duration-200"
                style={{ marginTop: "8px", fontSize: "11px", color: "rgba(255,255,255,0.28)", cursor: "pointer", background: "none", border: "none" }}
              >
                × Remove file
              </button>
            )}

            <div style={{ marginTop: "1rem", paddingBottom: "1rem" }}>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder="Special instructions (optional) — color notes, finishing requests…"
                className="sc-textarea placeholder:text-gray-700"
                style={{
                  width: "100%", borderRadius: "14px",
                  background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "white", fontSize: "13px", padding: "14px 16px",
                  resize: "none", lineHeight: 1.7,
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(4,4,16,0.98)",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          {proofResult ? (
            <button
              onClick={handleAddToCart}
              disabled={!canProceed}
              style={{
                width: "100%", maxWidth: "640px", padding: "16px", borderRadius: "14px",
                cursor: canProceed ? "pointer" : "not-allowed",
                fontFamily: "var(--font-orbitron)", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase",
                background: canProceed ? "white" : "rgba(255,255,255,0.07)",
                color: canProceed ? "black" : "rgba(255,255,255,0.22)",
                border: "none", transition: "all 0.2s ease",
                position: "relative", overflow: "hidden",
              }}
            >
              Add to Cart →
            </button>
          ) : (
            <button
              onClick={() => { if (file && canProceed) setPreflightOpen(true); }}
              disabled={!file || !canProceed}
              className={file && canProceed ? "sc-cta-active" : ""}
              style={{
                width: "100%", maxWidth: "640px", padding: "16px", borderRadius: "14px",
                cursor: file && canProceed ? "pointer" : "not-allowed",
                fontFamily: "var(--font-orbitron)", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase",
                background: file && canProceed
                  ? `linear-gradient(135deg,${accent} 0%,rgba(${accentRgb},0.72) 100%)`
                  : "rgba(255,255,255,0.05)",
                color: file && canProceed ? "white" : "rgba(255,255,255,0.2)",
                border: `1px solid ${file && canProceed ? `rgba(${accentRgb},0.4)` : "rgba(255,255,255,0.05)"}`,
                boxShadow: file && canProceed ? `0 4px 32px rgba(${accentRgb},0.45)` : "none",
                transition: "all 0.22s ease",
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              }}
            >
              {file ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Proof →
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" x2="12" y1="3" y2="15"/>
                  </svg>
                  Upload Artwork to Continue
                </>
              )}
            </button>
          )}
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}>
            Preview your design, then we&apos;ll add it to your cart and take you to checkout
          </p>
        </div>
      </div>
    </>
  );
}
