"use client";

import { useState, useEffect } from "react";

export type BorderThickness = "thin" | "normal" | "wide";
export type ShapeId = "die-cut" | "circle" | "oval" | "square" | "rectangle";
export type FitMode = "fill" | "fit" | "edge";
export type RoundedCorners = "none" | "soft" | "medium" | "heavy";

export interface ProofResult {
  processedUrl: string;
  originalUrl: string;
  shopifyUrl: string | null;
  designUrl: string | null;
  /** Vector cutline (customer-editable SVG) for the Graphtec cutter — separate from the raster preview above. */
  cutFileUrl: string | null;
  /** Production-ready PDF: artwork + vector CutContour path, for Illustrator/Cutting Master. */
  productionPdfUrl: string | null;
  borderThickness: BorderThickness;
  removedBackground: boolean;
  shape: ShapeId;
  fitMode: FitMode;
  roundedCorners: RoundedCorners;
  cutlineColor: string;
  bgColor: string;
}

interface Props {
  file: File;
  initialShape: ShapeId;
  material: string;
  /** Physical size (inches) the sticker is printed at, if already chosen — used to scale the vector cut-line offset accurately. */
  widthIn?: number;
  heightIn?: number;
  /**
   * "sticker" (default) shows the full shape/fit-mode/cutline-color controls
   * and generates a production vector cutline. "simple" is for products that
   * aren't cut to the artwork's shape (banners, laser engraving, etc.) — just
   * upload + proof preview, no cutline UI or file.
   */
  mode?: "sticker" | "simple";
  onApprove: (proof: ProofResult) => void;
  onClose: (changeNote?: string) => void;
}

const BORDER_PX: Record<BorderThickness, number> = { thin: 2, normal: 4, wide: 8 };
const RADIUS_MAP: Record<RoundedCorners, string> = {
  none: "0px",
  soft: "10px",
  medium: "24px",
  heavy: "60px",
};


function ShapeIcon({ id, size = 20 }: { id: ShapeId; size?: number }) {
  const sw = 1.5;
  switch (id) {
    case "die-cut":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}><path d="M4 2L14 1L22 6L23 15L18 22L8 23L1 17L2 8Z" strokeLinejoin="round" /></svg>;
    case "circle":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}><circle cx="12" cy="12" r="10" /></svg>;
    case "oval":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}><ellipse cx="12" cy="12" rx="7" ry="10" /></svg>;
    case "square":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}><rect x="3" y="3" width="18" height="18" /></svg>;
    case "rectangle":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}><rect x="2" y="6" width="20" height="12" /></svg>;
  }
}

function getContainerSize(shape: ShapeId, zoom: number): { w: number; h: number } {
  const base = 220 * zoom;
  switch (shape) {
    case "circle":
    case "square":
    case "die-cut": return { w: base, h: base };
    case "oval":    return { w: base * 0.72, h: base };
    case "rectangle": return { w: base * 1.45, h: base };
  }
}

function getClipStyle(shape: ShapeId, fitMode: FitMode, rc: RoundedCorners): React.CSSProperties {
  if (fitMode === "edge") return {};
  switch (shape) {
    case "circle":    return { borderRadius: "50%" };
    case "oval":      return { borderRadius: "50% / 40%" };
    case "square":    return { borderRadius: RADIUS_MAP[rc] };
    case "rectangle": return { borderRadius: RADIUS_MAP[rc] };
    default:          return {};
  }
}

export default function PreflightModal({ file, initialShape, material, widthIn, heightIn, mode = "sticker", onApprove, onClose }: Props) {
  const isSimple = mode === "simple";
  const [uploadStatus, setUploadStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [processedUrl, setProcessedUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [removedBg, setRemovedBg] = useState(false);

  const [shape, setShape] = useState<ShapeId>(initialShape);
  const [fitMode, setFitMode] = useState<FitMode>("edge");
  const [roundedCorners, setRoundedCorners] = useState<RoundedCorners>("none");
  const [border, setBorder] = useState<BorderThickness>("normal");
  const [zoom, setZoom] = useState(1);

  const [cutlineColor, setCutlineColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#060614");
  const [isSaving, setIsSaving] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    // Show image instantly from local file — no server round-trip needed
    const objectUrl = URL.createObjectURL(file);
    setProcessedUrl(objectUrl);
    setOriginalUrl(objectUrl);
    setProgress(100);
    setUploadStatus("ready");

    // In background: attempt background removal (non-blocking)
    const controller = new AbortController();
    const deadline = setTimeout(() => controller.abort(), 20_000);

    (async () => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const resp = await fetch("/api/upload", { method: "POST", body: fd, signal: controller.signal });
        if (!resp.ok) return;
        const data = await resp.json() as { processedUrl: string | null; removedBackground: boolean };
        if (data.processedUrl) setProcessedUrl(data.processedUrl);
        setRemovedBg(data.removedBackground ?? false);
      } catch {
        // timeout, network error, or no REMOVE_BG key — keep showing original, that's fine
      } finally {
        clearTimeout(deadline);
      }
    })();

    return () => {
      controller.abort();
      clearTimeout(deadline);
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const isEdge = fitMode === "edge";
  const showRoundedCorners = !isEdge && (shape === "square" || shape === "rectangle");
  const { w, h } = getContainerSize(shape, zoom);
  const clipStyle = getClipStyle(shape, fitMode, roundedCorners);

  const SHAPES: ShapeId[] = ["die-cut", "circle", "oval", "square", "rectangle"];
  const SHAPE_LABELS: Record<ShapeId, string> = { "die-cut": "Die", circle: "Circle", oval: "Oval", square: "Square", rectangle: "Rect" };

  return (
    <div className="fixed inset-0 z-200 bg-black/85 flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-[#0c0c14] border border-white/9 w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">

        {/* Close */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Left: Canvas ── */}
        <div
          className="flex-1 min-h-[300px] md:min-h-[500px] flex items-center justify-center relative overflow-hidden"
          style={{ background: bgColor, transition: "background 0.3s ease" }}
        >
          {/* Grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Zoom controls — left side */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
            <button
              onClick={() => setZoom((z) => Math.min(+(z + 0.2).toFixed(1), 2))}
              className="w-7 h-7 border border-white/10 bg-black/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/25 transition-colors text-sm font-bold"
            >+</button>
            <button
              onClick={() => setZoom((z) => Math.max(+(z - 0.2).toFixed(1), 0.4))}
              className="w-7 h-7 border border-white/10 bg-black/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/25 transition-colors text-sm font-bold"
            >−</button>
          </div>

          {/* Zoom level — bottom center */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00ff44" strokeWidth="2" opacity="0.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span className="text-[9px] text-[#00ff44]/50 tracking-widest">{Math.round(zoom * 100)}%</span>
          </div>

          {/* SVG filter for cutline — feMorphology dilate is GPU-accelerated, far cheaper than 16 CSS drop-shadows */}
          <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
            <defs>
              <filter id="cutline-outline" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                <feMorphology in="SourceAlpha" operator="dilate" radius={BORDER_PX[border]} result="dilated" />
                <feFlood floodColor={cutlineColor} result="color" />
                <feComposite in="color" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Preview */}
          {processedUrl && (
            <div className="relative z-10 flex items-center justify-center p-10">
              <div
                style={{
                  width: `${w}px`,
                  height: `${h}px`,
                  ...(isSimple ? {} : clipStyle),
                  overflow: isSimple || isEdge ? "visible" : "hidden",
                  border: isSimple ? "none" : isEdge ? "none" : `2px dashed ${cutlineColor}`,
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={processedUrl}
                  alt="Proof"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: isSimple ? "contain" : isEdge ? "contain" : fitMode === "fill" ? "cover" : "contain",
                    display: "block",
                    transition: "filter 0.15s ease",
                    ...(!isSimple && isEdge ? { filter: "url(#cutline-outline)", willChange: "filter" } : {}),
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Controls ── */}
        <div className="w-full md:w-[320px] flex flex-col border-t md:border-t-0 md:border-l border-white/[0.06] overflow-y-auto" style={{ maxHeight: "95vh" }}>
          <div className="p-6 flex flex-col gap-5">

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[8px] tracking-[0.5em] uppercase text-[#00ff44] font-bold" style={{ fontFamily: "var(--font-orbitron)" }}>Mission Launch</span>
                <div className="h-px flex-1 bg-[#00ff44]/20" />
                <span className="text-[8px] px-1.5 py-0.5 border border-white/10 text-gray-600 tracking-wider">Beta</span>
              </div>
              <h2 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>Proof Review</h2>
              <p className="text-xs text-gray-500 mt-0.5 capitalize">{material}</p>
            </div>

            {/* Shape selector — only relevant for products cut to the artwork's shape */}
            {!isSimple && (
            <div>
              <p className="text-[9px] tracking-[0.35em] uppercase text-gray-500 mb-2" style={{ fontFamily: "var(--font-orbitron)" }}>Shape</p>
              <div className="grid grid-cols-5 gap-1">
                {SHAPES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    disabled={uploadStatus !== "ready"}
                    title={SHAPE_LABELS[s]}
                    className={`flex flex-col items-center gap-1.5 py-2.5 border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                      shape === s
                        ? "border-[#00ff44]/50 bg-[#00ff44]/[0.06] text-white"
                        : "border-white/[0.07] text-gray-600 hover:border-white/20 hover:text-gray-400"
                    }`}
                  >
                    <ShapeIcon id={s} size={17} />
                    <span className="text-[7.5px] tracking-wider uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>
                      {SHAPE_LABELS[s]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Fit mode */}
            {!isSimple && (
            <div>
              <p className="text-[9px] tracking-[0.35em] uppercase text-gray-500 mb-2" style={{ fontFamily: "var(--font-orbitron)" }}>Mode</p>
              <div className="flex gap-1">
                {(["fill", "fit", "edge"] as FitMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFitMode(m)}
                    disabled={uploadStatus !== "ready"}
                    className={`flex-1 py-2 text-[10px] font-bold tracking-[0.12em] uppercase border transition-all duration-200 disabled:opacity-30 ${
                      fitMode === m
                        ? m === "edge"
                          ? "border-[#00ff44]/60 bg-[#00ff44]/[0.08] text-[#00ff44]"
                          : "border-white/40 bg-white/[0.08] text-white"
                        : "border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20"
                    }`}
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-gray-600 mt-1.5 leading-relaxed">
                {fitMode === "fill" ? "Image fills shape (may crop)" : fitMode === "fit" ? "Image fits inside shape" : "Cutline follows image edges"}
              </p>
            </div>
            )}

            {/* Rounded corners — only for square/rect in non-edge mode */}
            {!isSimple && showRoundedCorners && (
              <div>
                <p className="text-[9px] tracking-[0.35em] uppercase text-gray-500 mb-2" style={{ fontFamily: "var(--font-orbitron)" }}>Rounded Corners</p>
                <div className="grid grid-cols-4 gap-1">
                  {(["none", "soft", "medium", "heavy"] as RoundedCorners[]).map((rc) => {
                    const rx = { none: 0, soft: 3, medium: 7, heavy: 15 }[rc];
                    return (
                      <button
                        key={rc}
                        onClick={() => setRoundedCorners(rc)}
                        disabled={uploadStatus !== "ready"}
                        className={`flex flex-col items-center gap-1.5 py-2.5 border transition-all duration-200 disabled:opacity-30 ${
                          roundedCorners === rc
                            ? "border-[#00ff44]/50 bg-[#00ff44]/[0.05] text-white"
                            : "border-white/[0.07] text-gray-600 hover:border-white/20"
                        }`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <rect x="3" y="3" width="18" height="18" rx={rx} ry={rx} />
                        </svg>
                        <span className="text-[7.5px] tracking-wider uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>{rc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cutline thickness — only for edge mode */}
            {!isSimple && isEdge && (
              <div>
                <p className="text-[9px] tracking-[0.35em] uppercase text-gray-500 mb-2" style={{ fontFamily: "var(--font-orbitron)" }}>Cutline</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["thin", "normal", "wide"] as BorderThickness[]).map((b) => {
                    const sw = b === "thin" ? 1 : b === "normal" ? 2 : 3.5;
                    return (
                      <button
                        key={b}
                        onClick={() => setBorder(b)}
                        disabled={uploadStatus !== "ready"}
                        className={`flex flex-col items-center gap-2 py-3 border transition-all duration-200 disabled:opacity-30 ${
                          border === b
                            ? "border-[#00ff44]/50 bg-[#00ff44]/[0.04] text-white"
                            : "border-white/[0.07] text-gray-600 hover:border-white/20"
                        }`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M4 3L14 2L22 8L22 17L16 22L6 23L1 16L2 7Z" stroke="currentColor" strokeWidth={sw} strokeLinejoin="round" />
                        </svg>
                        <span className="text-[8px] tracking-widest uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>{b}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cutline Color — only in edge (die-cut) mode */}
            {!isSimple && isEdge && (
              <div>
                <p className="text-[9px] tracking-[0.35em] uppercase text-gray-500 mb-2" style={{ fontFamily: "var(--font-orbitron)" }}>Cutline Color</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {["#ffffff", "#000000", "#ffff00", "#ff3333", "#33aaff", "#ff66ff", "#00ff99"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCutlineColor(c)}
                      title={c}
                      className="w-7 h-7 rounded-full transition-all duration-200"
                      style={{
                        background: c,
                        outline: cutlineColor === c ? "2px solid white" : "2px solid transparent",
                        outlineOffset: "2px",
                        transform: cutlineColor === c ? "scale(1.15)" : "scale(1)",
                        border: c === "#ffffff" ? "1px solid rgba(255,255,255,0.3)" : "none",
                      }}
                    />
                  ))}
                  <label title="Custom color" className="relative w-7 h-7 rounded-full overflow-hidden cursor-pointer" style={{ background: "conic-gradient(red,yellow,lime,aqua,blue,magenta,red)", outline: "2px solid transparent", outlineOffset: "2px" }}>
                    <input type="color" value={cutlineColor} onChange={(e) => setCutlineColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </label>
                </div>
              </div>
            )}

            {/* Background Color */}
            <div>
              <p className="text-[9px] tracking-[0.35em] uppercase text-gray-500 mb-2" style={{ fontFamily: "var(--font-orbitron)" }}>Background</p>
              <div className="flex flex-wrap gap-2 items-center">
                {[
                  { color: "#060614", label: "Dark" },
                  { color: "#ffffff", label: "White" },
                  { color: "#000000", label: "Black" },
                  { color: "#1e2d4a", label: "Navy" },
                  { color: "#c0392b", label: "Red" },
                  { color: "#c0712b", label: "Orange" },
                  { color: "#b8962e", label: "Gold" },
                  { color: "#555555", label: "Gray" },
                ].map(({ color, label }) => (
                  <button
                    key={color}
                    onClick={() => setBgColor(color)}
                    title={label}
                    className="w-7 h-7 rounded-full transition-all duration-200"
                    style={{
                      background: color,
                      outline: bgColor === color ? "2px solid white" : "2px solid transparent",
                      outlineOffset: "2px",
                      transform: bgColor === color ? "scale(1.15)" : "scale(1)",
                      border: color === "#ffffff" ? "1px solid rgba(255,255,255,0.3)" : "none",
                    }}
                  />
                ))}
                <label title="Custom color" className="relative w-7 h-7 rounded-full overflow-hidden cursor-pointer" style={{ background: "conic-gradient(red,yellow,lime,aqua,blue,magenta,red)" }}>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </label>
              </div>
            </div>

            {/* Background status */}
            {uploadStatus === "ready" && (
              <div className={`flex items-start gap-2.5 p-3 border ${removedBg ? "border-green-500/20 bg-green-500/[0.03]" : "border-yellow-500/20 bg-yellow-500/[0.02]"}`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={removedBg ? "#22c55e" : "#eab308"} strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                  {removedBg
                    ? <polyline points="20 6 9 17 4 12" />
                    : <><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
                  }
                </svg>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {removedBg
                    ? isSimple ? "Background removed." : "Background removed. Green line = cutline."
                    : "No background removal. Image prints as-is."}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              {showChangeForm ? (
                <>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
                    Describe the changes needed:
                  </p>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={4}
                    placeholder="e.g. Remove the white background, make the text larger, adjust colors…"
                    className="w-full bg-white/[0.04] border border-white/10 text-white text-xs px-3 py-2.5 focus:outline-none focus:border-white/25 resize-none placeholder:text-gray-600 leading-relaxed"
                  />
                  <button
                    onClick={() => onClose(noteText.trim() || undefined)}
                    className="w-full py-3 text-xs font-bold tracking-[0.15em] uppercase bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] transition-all"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    Submit &amp; Continue →
                  </button>
                  <button
                    onClick={() => setShowChangeForm(false)}
                    className="w-full text-xs text-gray-500 hover:text-white transition-colors py-1.5"
                  >
                    ← Back to Proof
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={async () => {
                      if (uploadStatus !== "ready" || isSaving) return;
                      setIsSaving(true);
                      let shopifyUrl: string | null = null;
                      let designUrl: string | null = null;
                      let cutFileUrl: string | null = null;
                      let productionPdfUrl: string | null = null;
                      try {
                        const blob = await fetch(processedUrl).then((r) => r.blob());
                        const fd = new FormData();
                        fd.append("file", blob, file.name.replace(/\.[^.]+$/, "") + ".png");
                        fd.append("shape", shape);
                        fd.append("fitMode", fitMode);
                        fd.append("borderThickness", border);
                        fd.append("roundedCorners", roundedCorners);
                        fd.append("removedBackground", String(removedBg));
                        fd.append("fileName", file.name);
                        fd.append("skipCutline", String(isSimple));
                        if (widthIn) fd.append("widthIn", String(widthIn));
                        if (heightIn) fd.append("heightIn", String(heightIn));
                        const resp2 = await fetch("/api/proof", { method: "POST", body: fd });
                        const data2 = (await resp2.json()) as {
                          shopifyUrl?: string | null; designUrl?: string | null;
                          cutFileUrl?: string | null; productionPdfUrl?: string | null;
                        };
                        shopifyUrl = data2.shopifyUrl ?? null;
                        designUrl = data2.designUrl ?? null;
                        cutFileUrl = data2.cutFileUrl ?? null;
                        productionPdfUrl = data2.productionPdfUrl ?? null;
                      } catch {
                        // non-fatal — approve without shopifyUrl
                      }
                      setIsSaving(false);
                      onApprove({ processedUrl, originalUrl, shopifyUrl, designUrl, cutFileUrl, productionPdfUrl, borderThickness: border, removedBackground: removedBg, shape, fitMode, roundedCorners, cutlineColor, bgColor });
                    }}
                    disabled={uploadStatus !== "ready" || isSaving}
                    className="w-full py-3.5 text-sm font-bold tracking-[0.15em] uppercase bg-[#22c55e] text-black hover:bg-[#16a34a] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Take this design ✓"
                    )}
                  </button>
                  <button
                    onClick={() => setShowChangeForm(true)}
                    className="w-full text-xs text-gray-500 hover:text-white transition-colors py-2"
                  >
                    No, I need changes
                  </button>
                </>
              )}
            </div>

            {/* What is Mission Launch */}
            <div className="border-t border-white/5 pt-4">
              <p className="text-[8px] font-bold tracking-[0.4em] uppercase text-yellow-400/70 mb-2" style={{ fontFamily: "var(--font-orbitron)" }}>
                What is Mission Launch?
              </p>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                {isSimple
                  ? "Automated proof system. We process your file and show a preview. A human reviews every order before printing."
                  : "Automated proof system. We process your file and show a cutline preview. A human reviews every order before printing."}
              </p>
              <p className="text-[10px] text-gray-600 leading-relaxed mt-1.5">
                If the preview doesn&apos;t look right, tap{" "}
                <span className="text-gray-400">No, I need changes</span>{" "}
                and re-upload or add instructions.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
