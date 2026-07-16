"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import type { VinylStickerCartItem } from "@/lib/cart-types";
import PreflightModal, { type ProofResult, type ShapeId as PreflightShapeId } from "./PreflightModal";
import { unitPrice, savePct, POPULAR_SIZES, QTY_PRESETS, MIN_QTY, type CutType as PricingCutType } from "@/lib/pricing";

type Finish = "matte" | "gloss";
type CutType = "contour" | "kiss";
type ShapeId = "custom" | "circle" | "oval" | "square" | "rectangle";
type SizeId = "2x2" | "3x3" | "4x4" | "5x5" | "custom";

const ACCENT = "#22c55e";
const ACCENT_RGB = "34,197,94";
const PRODUCT = "easy-peel" as const;

const SHAPES: { id: ShapeId; label: string }[] = [
  { id: "custom", label: "Custom Shape" },
  { id: "square", label: "Square" },
  { id: "circle", label: "Circle" },
  { id: "rectangle", label: "Rectangle" },
  { id: "oval", label: "Oval" },
];

const SIZE_PRESETS: { id: Exclude<SizeId, "custom">; label: string; w: number; h: number }[] = [
  { id: "2x2", label: '2" × 2"', w: 2, h: 2 },
  { id: "3x3", label: '3" × 3"', w: 3, h: 3 },
  { id: "4x4", label: '4" × 4"', w: 4, h: 4 },
  { id: "5x5", label: '5" × 5"', w: 5, h: 5 },
];

// Easy Peel is vinyl + a pull tab — reuses the vinyl shape-preview art (no separate art was supplied).
function shapeImage(shape: ShapeId, cut: CutType): string {
  return `/shapes/vinyl-${shape}-${cut}.png`;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

export default function EasyPeelConfigurator() {
  const [cutType, setCutType] = useState<CutType>("contour");
  const [shape, setShape] = useState<ShapeId>("custom");
  const [finish, setFinish] = useState<Finish>("gloss");
  const [sizeId, setSizeId] = useState<SizeId>("3x3");
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [selectedTierQty, setSelectedTierQty] = useState<number | "custom">(100);
  const [customQtyInput, setCustomQtyInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [preflightOpen, setPreflightOpen] = useState(false);
  const [proofResult, setProofResult] = useState<ProofResult | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();
  const router = useRouter();

  const pricingCut: PricingCutType = cutType === "kiss" ? "kiss" : "contour";

  const dims = useMemo(() => {
    if (sizeId === "custom") {
      const w = parseFloat(customW);
      const h = parseFloat(customH);
      return isFinite(w) && isFinite(h) && w > 0 && h > 0 ? { w, h } : null;
    }
    const preset = SIZE_PRESETS.find((s) => s.id === sizeId)!;
    return { w: preset.w, h: preset.h };
  }, [sizeId, customW, customH]);

  const activeQty = selectedTierQty === "custom" ? parseInt(customQtyInput) || 0 : selectedTierQty;

  function priceFor(qty: number): { perUnit: number; total: number; savings: number } {
    if (!dims || qty <= 0) return { perUnit: 0, total: 0, savings: 0 };
    const perUnit = unitPrice(PRODUCT, pricingCut, dims.w, dims.h, qty);
    const total = Math.round(perUnit * qty * 100) / 100;
    const savings = savePct(PRODUCT, pricingCut, dims.w, dims.h, qty);
    return { perUnit, total, savings };
  }

  const { perUnit: activePerUnit, total: activeTotal } = priceFor(activeQty);

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
    const cutLabel = cutType === "kiss" ? "Kiss Cut" : "Contour Cut";

    const cartItem: Omit<VinylStickerCartItem, "id" | "addedAt"> = {
      kind: "vinyl-sticker",
      cutType,
      title: "Easy Peel Stickers",
      subtitle: `Easy Peel · ${finish} · ${cutLabel} · ${sizeLabel} · Qty ${activeQty}`,
      thumbnail: proofResult?.designUrl ?? proofResult?.shopifyUrl ?? "",
      unitLabel: "stickers",
      totalPrice: activeTotal,
      quantity: activeQty,
      shape,
      material: "easy-peel",
      finish,
      size: sizeId === "custom" ? "custom" : sizeId,
      customWidth: sizeId === "custom" && customW ? Number(customW) : undefined,
      customHeight: sizeId === "custom" && customH ? Number(customH) : undefined,
      roundedCorners: null,
      tierQty: activeQty,
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
            cutlineColor: proofResult.cutlineColor,
            bgColor: proofResult.bgColor,
          }
        : undefined,
    };
    addItem(cartItem);
    router.push("/cart");
  }

  const canProceed =
    dims !== null &&
    (selectedTierQty !== "custom" || (customQtyInput !== "" && parseInt(customQtyInput) >= MIN_QTY));

  const shapeToPreflightId: Record<ShapeId, PreflightShapeId> = {
    custom: "die-cut", circle: "circle", oval: "oval", square: "square", rectangle: "rectangle",
  };

  return (
    <>
      <style>{`
        @keyframes ep-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes ep-shimmer { 0% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(250%) skewX(-20deg); } }
        @keyframes ep-shine { 0% { left: -80%; } 100% { left: 130%; } }
        .ep-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .ep-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .ep-opt { position: relative; overflow: hidden; transition: all 0.22s cubic-bezier(0.4,0,0.2,1); }
        .ep-opt::before {
          content: ''; position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-150%) skewX(-20deg); pointer-events: none;
        }
        .ep-opt:hover::before { animation: ep-shimmer 0.55s ease forwards; }
        .ep-opt > * { position: relative; z-index: 1; }
        .ep-upload-icon { animation: ep-float 3s ease-in-out infinite; }
        .ep-cta-active::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 35%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: ep-shine 2.8s ease-in-out infinite; pointer-events: none;
        }
        .ep-input:focus { outline: none; border-color: rgba(${ACCENT_RGB}, 0.55) !important; box-shadow: 0 0 0 3px rgba(${ACCENT_RGB}, 0.12); }
      `}</style>

      {preflightOpen && file && (
        <PreflightModal
          file={file}
          initialShape={shapeToPreflightId[shape]}
          material="easy peel"
          widthIn={dims?.w}
          heightIn={dims?.h}
          onApprove={(proof) => { setProofResult(proof); setPreflightOpen(false); }}
          onClose={(note) => {
            setPreflightOpen(false);
            if (note) setInstructions((p) => p ? `${p}\n\nChange Request: ${note}` : `Change Request: ${note}`);
          }}
        />
      )}

      <div className="min-h-screen pb-28 overflow-x-hidden" style={{ background: "#040410" }}>
        <div className="max-w-400 mx-auto px-4">

          {/* ── Hero ── */}
          <div className="mt-6 rounded-3xl overflow-hidden relative" style={{
            background: "linear-gradient(135deg,#0c0c2e 0%,#131050 45%,#0c0c2a 100%)",
            border: `1px solid rgba(${ACCENT_RGB},0.18)`, minHeight: "150px",
          }}>
            <div className="relative z-10 px-8 py-7">
              <p style={{ fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase", fontFamily: "var(--font-orbitron)", color: `rgba(${ACCENT_RGB},0.75)`, marginBottom: "0.5rem" }}>
                Custom Stickers
              </p>
              <h1 style={{
                fontFamily: "var(--font-orbitron)", fontWeight: 900, fontSize: "clamp(1.75rem,3.5vw,2.75rem)", lineHeight: 1.1,
                background: `linear-gradient(135deg,#fff 0%,rgba(${ACCENT_RGB},1) 55%,rgba(${ACCENT_RGB},0.65) 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Easy Peel Stickers
              </h1>
              <p style={{ color: `rgba(${ACCENT_RGB},0.85)`, fontSize: "0.875rem", fontWeight: 600, marginTop: "0.4rem" }}>
                A pull tab on every sticker, so it peels off the backing faster and easier.
              </p>
            </div>
          </div>

          {/* ── 4-column grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">

            {/* Shape */}
            <div className="ep-card rounded-[20px] p-5 flex flex-col gap-3.5" style={{ background: "linear-gradient(145deg,#08082a 0%,#0c0c32 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>Select Shape</h2>

              <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", background: "#07071e", borderRadius: "12px", padding: "4px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{
                  position: "absolute", top: "4px", bottom: "4px", left: cutType === "contour" ? "4px" : "calc(50% + 2px)", width: "calc(50% - 6px)",
                  background: `linear-gradient(135deg,${ACCENT}cc,${ACCENT})`, borderRadius: "8px", transition: "left 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                }} />
                {([{ id: "contour" as CutType, label: "Contour Cut", sub: "Shape-cut" }, { id: "kiss" as CutType, label: "Kiss Cut", sub: "On backing" }]).map((ct) => (
                  <button key={ct.id} onClick={() => setCutType(ct.id)} style={{ position: "relative", zIndex: 1, padding: "8px 4px", borderRadius: "8px", cursor: "pointer", border: "none", background: "transparent", textAlign: "center" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-orbitron)", color: cutType === ct.id ? "white" : "rgba(255,255,255,0.32)" }}>{ct.label}</div>
                    <div style={{ fontSize: "8px", marginTop: "2px", color: cutType === ct.id ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.18)" }}>{ct.sub}</div>
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {SHAPES.map((s) => {
                  const sel = shape === s.id;
                  return (
                    <button key={s.id} className="ep-opt" onClick={() => setShape(s.id)} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 6px 6px", borderRadius: "12px", cursor: "pointer",
                      border: `1px solid ${sel ? `rgba(${ACCENT_RGB},0.55)` : "rgba(255,255,255,0.07)"}`,
                      background: sel ? `rgba(${ACCENT_RGB},0.1)` : "rgba(255,255,255,0.03)",
                    }}>
                      <div style={{ position: "relative", width: "48px", height: "48px" }}>
                        <Image src={shapeImage(s.id, cutType)} alt={s.label} fill className="object-contain" unoptimized />
                      </div>
                      <span style={{ fontSize: "9px", fontWeight: 600, fontFamily: "var(--font-orbitron)", letterSpacing: "0.08em", color: sel ? ACCENT : "rgba(255,255,255,0.38)" }}>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div className="ep-card rounded-[20px] p-5 flex flex-col gap-3" style={{ background: "linear-gradient(145deg,#08082a 0%,#0c0c32 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>Select Size</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {SIZE_PRESETS.map((s) => {
                  const sel = sizeId === s.id;
                  return (
                    <button key={s.id} className="ep-opt" onClick={() => setSizeId(s.id)} style={{
                      padding: "16px 8px", borderRadius: "14px", cursor: "pointer",
                      border: `1px solid ${sel ? `rgba(${ACCENT_RGB},0.55)` : "rgba(255,255,255,0.07)"}`,
                      background: sel ? `rgba(${ACCENT_RGB},0.1)` : "rgba(255,255,255,0.03)",
                      fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-orbitron)", color: sel ? "white" : "rgba(255,255,255,0.5)",
                    }}>
                      {s.label}
                    </button>
                  );
                })}
              </div>
              <button className="ep-opt" onClick={() => setSizeId("custom")} style={{
                width: "100%", padding: "10px", borderRadius: "12px", cursor: "pointer",
                border: `1px solid ${sizeId === "custom" ? `rgba(${ACCENT_RGB},0.55)` : "rgba(255,255,255,0.07)"}`,
                background: sizeId === "custom" ? `rgba(${ACCENT_RGB},0.1)` : "rgba(255,255,255,0.03)",
                fontSize: "11px", fontWeight: 600, fontFamily: "var(--font-orbitron)", letterSpacing: "0.08em",
                color: sizeId === "custom" ? "white" : "rgba(255,255,255,0.38)",
              }}>
                Custom Size
              </button>
              {sizeId === "custom" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="number" min="0.5" max="24" step="0.25" value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder="W (in)" className="ep-input"
                      style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "13px", padding: "8px 12px", borderRadius: "10px" }} />
                    <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "14px" }}>×</span>
                    <input type="number" min="0.5" max="24" step="0.25" value={customH} onChange={(e) => setCustomH(e.target.value)} placeholder="H (in)" className="ep-input"
                      style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "13px", padding: "8px 12px", borderRadius: "10px" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-orbitron)", letterSpacing: "0.08em", marginBottom: "6px" }}>OTHER POPULAR SIZES:</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      {POPULAR_SIZES.map((p) => {
                        const active = customW === String(p.w) && customH === String(p.h);
                        return (
                          <button key={p.key} className="ep-opt" onClick={() => { setCustomW(String(p.w)); setCustomH(String(p.h)); }} style={{
                            padding: "8px 6px", borderRadius: "10px", cursor: "pointer",
                            border: `1px solid ${active ? `rgba(${ACCENT_RGB},0.5)` : "rgba(255,255,255,0.07)"}`,
                            background: active ? `rgba(${ACCENT_RGB},0.12)` : "rgba(255,255,255,0.03)",
                            fontSize: "11px", fontWeight: 600, color: active ? "white" : "rgba(255,255,255,0.5)",
                          }}>
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Finish */}
            <div className="ep-card rounded-[20px] p-5 flex flex-col gap-3" style={{ background: "linear-gradient(145deg,#08082a 0%,#0c0c32 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>Select Finish</h2>
              <div className="flex flex-col gap-2">
                {([{ id: "gloss" as Finish, label: "Gloss", sub: "Bold shine. Vibrant colors." }, { id: "matte" as Finish, label: "Matte", sub: "Smooth finish. No glare." }]).map((f) => {
                  const sel = finish === f.id;
                  return (
                    <button key={f.id} className="ep-opt" onClick={() => setFinish(f.id)} style={{
                      display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "14px", cursor: "pointer", textAlign: "left",
                      border: `2px solid ${sel ? ACCENT : "rgba(255,255,255,0.07)"}`,
                      background: sel ? `rgba(${ACCENT_RGB},0.08)` : "rgba(255,255,255,0.02)",
                    }}>
                      <div>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "white" }}>{f.label}</p>
                        <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{f.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="ep-card rounded-[20px] p-5 flex flex-col gap-2" style={{ background: "linear-gradient(145deg,#08082a 0%,#0c0c32 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>Select Quantity</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
                {QTY_PRESETS.map((qty) => {
                  const { total: tot, savings: sav } = priceFor(qty);
                  const active = selectedTierQty === qty;
                  return (
                    <button key={qty} className="ep-opt" onClick={() => setSelectedTierQty(qty)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: "10px", cursor: "pointer",
                      border: `1px solid ${active ? `rgba(${ACCENT_RGB},0.5)` : "transparent"}`,
                      background: active ? `rgba(${ACCENT_RGB},0.14)` : "transparent",
                    }}>
                      <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "11px", fontWeight: 700, color: active ? "white" : "rgba(255,255,255,0.55)" }}>
                        {qty >= 1000 ? `${qty / 1000}k` : qty}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: active ? "white" : "rgba(255,255,255,0.7)" }}>{tot > 0 ? fmt(tot) : "—"}</span>
                        {sav > 0 && (
                          <span style={{ fontSize: "8px", fontWeight: 700, padding: "2px 7px", borderRadius: "100px", fontFamily: "var(--font-orbitron)", background: active ? `rgba(${ACCENT_RGB},0.3)` : "rgba(34,197,94,0.14)", color: active ? ACCENT : "#22c55e" }}>
                            Save {sav}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
                <button className="ep-opt" onClick={() => setSelectedTierQty("custom")} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: "10px", cursor: "pointer",
                  border: `1px solid ${selectedTierQty === "custom" ? `rgba(${ACCENT_RGB},0.5)` : "rgba(255,255,255,0.06)"}`,
                  background: selectedTierQty === "custom" ? `rgba(${ACCENT_RGB},0.14)` : "rgba(255,255,255,0.02)",
                }}>
                  <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "11px", fontWeight: 700, color: selectedTierQty === "custom" ? "white" : "rgba(255,255,255,0.45)" }}>Custom</span>
                  <span style={{ fontSize: "9px", color: selectedTierQty === "custom" ? ACCENT : "rgba(255,255,255,0.28)", fontFamily: "var(--font-orbitron)" }}>Enter qty →</span>
                </button>
                {selectedTierQty === "custom" && (
                  <input type="number" min={MIN_QTY} max="50000" step="1" value={customQtyInput} onChange={(e) => setCustomQtyInput(e.target.value)} placeholder={`Enter quantity (min ${MIN_QTY})`} className="ep-input"
                    style={{ marginTop: "4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "13px", padding: "9px 12px", borderRadius: "10px" }} />
                )}
              </div>
              <div style={{ marginTop: "6px", borderRadius: "14px", padding: "14px 16px", background: `linear-gradient(135deg,rgba(${ACCENT_RGB},0.2) 0%,rgba(${ACCENT_RGB},0.1) 100%)`, border: `1px solid rgba(${ACCENT_RGB},0.28)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "8px", fontFamily: "var(--font-orbitron)", color: `rgba(${ACCENT_RGB},0.65)`, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "3px" }}>Total</p>
                    <p style={{ fontFamily: "var(--font-orbitron)", fontSize: "1.125rem", fontWeight: 900, color: "white" }}>{activeTotal > 0 ? fmt(activeTotal) : dims === null ? "Enter size" : "—"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "8px", fontFamily: "var(--font-orbitron)", color: `rgba(${ACCENT_RGB},0.65)`, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "3px" }}>Per unit</p>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: `rgba(${ACCENT_RGB},0.9)` }}>{activePerUnit > 0 ? fmt(activePerUnit) : "—"}</p>
                  </div>
                </div>
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
                border: `2px dashed ${dragging ? ACCENT : proofResult ? "#22c55e" : file ? `rgba(${ACCENT_RGB},0.4)` : "rgba(255,255,255,0.11)"}`,
                background: dragging ? `rgba(${ACCENT_RGB},0.07)` : proofResult ? "rgba(34,197,94,0.04)" : file ? `rgba(${ACCENT_RGB},0.04)` : "#06061a",
                cursor: "pointer", minHeight: "160px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "16px", padding: "2.5rem", transition: "all 0.25s ease",
              }}
            >
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,application/pdf,image/svg+xml" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

              {proofResult ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  {filePreview && <Image src={filePreview} alt="Approved proof" width={96} height={96} className="max-h-24 object-contain" />}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#22c55e", fontFamily: "var(--font-orbitron)", letterSpacing: "0.06em" }}>Proof Approved</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "rgba(34,197,94,0.65)" }}>Ready to add to cart</p>
                </div>
              ) : filePreview ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div style={{ position: "relative", width: "96px", height: "96px" }}>
                    <Image src={filePreview} alt="Design preview" fill className="object-contain" />
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>{file?.name}</p>
                  <p style={{ fontSize: "11px", color: `rgba(${ACCENT_RGB},0.7)` }}>Click &quot;View Proof&quot; below to continue →</p>
                </div>
              ) : (
                <>
                  <div className="ep-upload-icon" style={{ width: "64px", height: "64px", borderRadius: "50%", background: `rgba(${ACCENT_RGB},0.1)`, border: `1px solid rgba(${ACCENT_RGB},0.2)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
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
                value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2}
                placeholder="Special instructions (optional) — color notes, finishing requests…"
                style={{ width: "100%", borderRadius: "14px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", color: "white", fontSize: "13px", padding: "14px 16px", resize: "none", lineHeight: 1.7 }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(4,4,16,0.98)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          {proofResult ? (
            <button onClick={handleAddToCart} disabled={!canProceed} style={{
              width: "100%", maxWidth: "640px", padding: "16px", borderRadius: "14px",
              cursor: canProceed ? "pointer" : "not-allowed",
              fontFamily: "var(--font-orbitron)", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase",
              background: canProceed ? "white" : "rgba(255,255,255,0.07)",
              color: canProceed ? "black" : "rgba(255,255,255,0.22)",
              border: "none", transition: "all 0.2s ease",
            }}>
              Add to Cart →
            </button>
          ) : (
            <button
              onClick={() => { if (file && canProceed) setPreflightOpen(true); }}
              disabled={!file || !canProceed}
              className={file && canProceed ? "ep-cta-active" : ""}
              style={{
                width: "100%", maxWidth: "640px", padding: "16px", borderRadius: "14px",
                cursor: file && canProceed ? "pointer" : "not-allowed",
                fontFamily: "var(--font-orbitron)", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase",
                background: file && canProceed ? `linear-gradient(135deg,${ACCENT} 0%,rgba(${ACCENT_RGB},0.72) 100%)` : "rgba(255,255,255,0.05)",
                color: file && canProceed ? "white" : "rgba(255,255,255,0.2)",
                border: `1px solid ${file && canProceed ? `rgba(${ACCENT_RGB},0.4)` : "rgba(255,255,255,0.05)"}`,
                boxShadow: file && canProceed ? `0 4px 32px rgba(${ACCENT_RGB},0.45)` : "none",
                transition: "all 0.22s ease", position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              }}
            >
              {file ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                  View Proof →
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
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
