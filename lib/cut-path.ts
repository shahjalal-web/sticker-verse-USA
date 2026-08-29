// Generates a real, machine-ready vector cut path from a transparent PNG's
// alpha channel — the piece remove.bg does NOT provide. remove.bg only
// removes the background; this module traces the resulting alpha boundary,
// simplifies it, offsets it outward (standard sticker bleed), and emits it
// as SVG-path syntax that's reused for both the customer-editable SVG and
// the production PDF.
//
// Deliberately dependency-light and pure-JS (no OpenCV / native bindings):
// this runs inside a Vercel serverless function, where native image libs
// beyond `sharp` (already used for the raster proof) are impractical to
// deploy. Contour tracing is hand-rolled (Moore-neighbor boundary tracing)
// instead of pulling in the `marchingsquares` package, which is AGPL-3.0 —
// a copyleft license unsuitable for a client's closed-source commercial site.

import ClipperLib from "clipper-lib";
import simplify from "simplify-js";

export type Pt = { x: number; y: number };

const CLIPPER_SCALE = 1000; // clipper-lib works in integers; scale for sub-pixel precision

// ─── Alpha channel extraction ──────────────────────────────────────────────

export async function extractAlphaMask(
  buf: Buffer,
): Promise<{ width: number; height: number; alpha: Uint8Array }> {
  const sharp = (await import("sharp")).default;
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) alpha[i] = data[i * channels + (channels - 1)];
  return { width, height, alpha };
}

// ─── Connected-component boundary tracing (Moore-neighbor) ────────────────

// Clockwise neighbor offsets starting at North — used both for the boundary
// walk and for picking a deterministic start pixel per component.
const NEIGHBORS: [number, number][] = [
  [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1],
];
const WEST_IDX = 6;

function isFg(alpha: Uint8Array, w: number, h: number, x: number, y: number, threshold: number): boolean {
  if (x < 0 || y < 0 || x >= w || y >= h) return false;
  return alpha[y * w + x] >= threshold;
}

// Traces the outer boundary of the connected component containing (sx, sy),
// where (sx, sy) is guaranteed to be that component's topmost-then-leftmost
// pixel (true for the first unvisited foreground pixel found in a row-major
// scan). Uses Moore-neighbor tracing with Jacob's stopping criterion.
function traceBoundary(
  alpha: Uint8Array, w: number, h: number, sx: number, sy: number, threshold: number,
): Pt[] {
  const fg = (x: number, y: number) => isFg(alpha, w, h, x, y, threshold);
  const P0 = { x: sx, y: sy };
  const boundary: Pt[] = [P0];
  const maxSteps = w * h * 4 + 8;

  // West and North of P0 are guaranteed background by construction, so the
  // first neighbor scan (clockwise, starting just after West) always finds
  // a real boundary pixel unless P0 is an isolated single-pixel speck.
  let dirIdx = -1;
  for (let k = 1; k <= 8; k++) {
    const d = (WEST_IDX + k) % 8;
    const [dx, dy] = NEIGHBORS[d];
    if (fg(P0.x + dx, P0.y + dy)) { dirIdx = d; break; }
  }
  if (dirIdx === -1) return boundary; // isolated pixel, no boundary to walk

  let cur = { x: P0.x + NEIGHBORS[dirIdx][0], y: P0.y + NEIGHBORS[dirIdx][1] };
  let backtrackDir = (dirIdx + 4) % 8;
  const P1 = { ...cur };
  boundary.push(cur);

  for (let guard = 0; guard < maxSteps; guard++) {
    let found = -1;
    let next = { x: 0, y: 0 };
    for (let k = 1; k <= 8; k++) {
      const d = (backtrackDir + k) % 8;
      const [dx, dy] = NEIGHBORS[d];
      const nx = cur.x + dx, ny = cur.y + dy;
      if (fg(nx, ny)) { found = d; next = { x: nx, y: ny }; break; }
    }
    if (found === -1) break; // shouldn't happen for a real boundary pixel

    const newBacktrack = (found + 4) % 8;

    // Jacob's stopping criterion: stop once we're back at the same
    // (pixel, entry-direction) state as the very first step.
    if (cur.x === P0.x && cur.y === P0.y && next.x === P1.x && next.y === P1.y) break;

    boundary.push(next);
    cur = next;
    backtrackDir = newBacktrack;
  }

  return boundary;
}

export interface ContourOptions {
  /** Alpha threshold (0-255) above which a pixel counts as opaque. Default 16. */
  threshold?: number;
  /** Connected components smaller than this (in px²) are treated as noise and skipped. Default 24. */
  minAreaPx?: number;
}

// Traces the outer boundary of every sufficiently large connected component
// in the alpha mask. Holes (e.g. the inside of a letter "O") are not
// traced — a sticker cut only follows the outer silhouette.
export function traceContours(
  alpha: Uint8Array, width: number, height: number, opts: ContourOptions = {},
): Pt[][] {
  const threshold = opts.threshold ?? 16;
  const minArea = opts.minAreaPx ?? 24;
  const visited = new Uint8Array(width * height);
  const fg = (x: number, y: number) => isFg(alpha, width, height, x, y, threshold);
  const contours: Pt[][] = [];
  const dirs4: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (visited[idx] || !fg(x, y)) continue;

      // Flood-fill (4-connectivity) to measure area and mark the whole
      // component visited, so the outer scan skips its interior later.
      const stack: [number, number][] = [[x, y]];
      visited[idx] = 1;
      let area = 0;
      while (stack.length) {
        const [cx, cy] = stack.pop()!;
        area++;
        for (const [dx, dy] of dirs4) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const nidx = ny * width + nx;
          if (visited[nidx] || !fg(nx, ny)) continue;
          visited[nidx] = 1;
          stack.push([nx, ny]);
        }
      }

      if (area < minArea) continue;

      const boundary = traceBoundary(alpha, width, height, x, y, threshold);
      if (boundary.length >= 3) contours.push(boundary);
    }
  }

  return contours;
}

// ─── Simplify (Douglas-Peucker via simplify-js) ────────────────────────────

export function simplifyContour(points: Pt[], tolerance: number): Pt[] {
  if (points.length < 4) return points;
  const out = simplify(points, tolerance, true);
  return out.length >= 3 ? out : points;
}

// ─── Outward offset (Clipper2-equivalent via clipper-lib) ──────────────────

export function offsetContour(points: Pt[], offsetPx: number): Pt[] {
  if (points.length < 3 || offsetPx === 0) return points;

  type IntPoint = { X: number; Y: number };
  const path: IntPoint[] = points.map((p) => ({
    X: Math.round(p.x * CLIPPER_SCALE),
    Y: Math.round(p.y * CLIPPER_SCALE),
  }));

  // ClipperOffset grows a path outward for a positive delta only when the
  // path is oriented correctly — normalize orientation first.
  if (!ClipperLib.Clipper.Orientation(path)) path.reverse();

  // arcTolerance is in the same (scaled) coordinate space as the path itself
  // — passing the unscaled "0.25px" here made Clipper approximate every
  // round join to within 0.00025 real px, exploding round-corner offsets
  // into tens of thousands of points on real (non-synthetic) artwork.
  const co = new ClipperLib.ClipperOffset(2, 0.25 * CLIPPER_SCALE);
  co.AddPath(path, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
  const solution: ClipperLib.Paths = [];
  co.Execute(solution, offsetPx * CLIPPER_SCALE);

  if (!solution.length) return points;
  let best = solution[0];
  for (const p of solution) if (p.length > best.length) best = p;

  const offset = best.map((ip: IntPoint) => ({ x: ip.X / CLIPPER_SCALE, y: ip.Y / CLIPPER_SCALE }));
  // Round joins still add points beyond what's visually necessary — a light
  // second simplify pass keeps output size sane without visibly changing the shape.
  return simplifyContour(offset, 0.5);
}

// ─── SVG path-data builders ─────────────────────────────────────────────────
// Shared between the customer-editable SVG and the production PDF (pdf-lib's
// drawSvgPath consumes the same 'd' syntax).

function fmt(n: number): string {
  return Number(n.toFixed(2)).toString();
}

export function polygonToPathD(points: Pt[]): string {
  if (!points.length) return "";
  const [first, ...rest] = points;
  return [`M ${fmt(first.x)} ${fmt(first.y)}`, ...rest.map((p) => `L ${fmt(p.x)} ${fmt(p.y)}`), "Z"].join(" ");
}

export function circlePathD(cx: number, cy: number, r: number): string {
  return `M ${fmt(cx - r)} ${fmt(cy)} A ${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(cx + r)} ${fmt(cy)} A ${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(cx - r)} ${fmt(cy)} Z`;
}

export function ellipsePathD(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${fmt(cx - rx)} ${fmt(cy)} A ${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(cx + rx)} ${fmt(cy)} A ${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(cx - rx)} ${fmt(cy)} Z`;
}

export function roundedRectPathD(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  if (rr <= 0.01) return `M ${fmt(x)} ${fmt(y)} H ${fmt(x + w)} V ${fmt(y + h)} H ${fmt(x)} Z`;
  return [
    `M ${fmt(x + rr)} ${fmt(y)}`,
    `H ${fmt(x + w - rr)}`,
    `A ${fmt(rr)} ${fmt(rr)} 0 0 1 ${fmt(x + w)} ${fmt(y + rr)}`,
    `V ${fmt(y + h - rr)}`,
    `A ${fmt(rr)} ${fmt(rr)} 0 0 1 ${fmt(x + w - rr)} ${fmt(y + h)}`,
    `H ${fmt(x + rr)}`,
    `A ${fmt(rr)} ${fmt(rr)} 0 0 1 ${fmt(x)} ${fmt(y + h - rr)}`,
    `V ${fmt(y + rr)}`,
    `A ${fmt(rr)} ${fmt(rr)} 0 0 1 ${fmt(x + rr)} ${fmt(y)}`,
    "Z",
  ].join(" ");
}

// ─── Top-level orchestrator ────────────────────────────────────────────────

export type CutShape = "die-cut" | "circle" | "oval" | "square" | "rectangle";
export type CutFitMode = "fill" | "fit" | "edge";
export type CutRoundedCorners = "none" | "soft" | "medium" | "heavy";

const RC_FRACTION: Record<CutRoundedCorners, number> = { none: 0, soft: 0.045, medium: 0.11, heavy: 0.27 };

// Standard sticker bleed: how far the cut line sits outside the artwork edge.
const DEFAULT_OFFSET_IN = 0.09; // midpoint of the client-specified 0.0625–0.125" range
const DEFAULT_DPI_FALLBACK = 300; // used only when physical size wasn't supplied

export interface CutPathResult {
  /** Pixel canvas the path coordinates are drawn against — includes the bleed
   * margin around the artwork, so the offset cutline is never clipped. */
  width: number;
  height: number;
  /** One SVG path 'd' string per disjoint contour (usually just one). */
  pathD: string[];
  /** Where (and at what size) to draw the artwork image within the canvas above. */
  imageX: number;
  imageY: number;
  imageW: number;
  imageH: number;
  /** Pixels-per-inch this canvas was built at — lets output builders convert
   * pixel dimensions to real physical units (PDF points, SVG "in" units). */
  pxPerInch: number;
}

export async function buildCutPath(params: {
  buf: Buffer;
  shape: CutShape;
  fitMode: CutFitMode;
  roundedCorners: CutRoundedCorners;
  removedBackground: boolean;
  /** Physical bounding box the artwork is sized into, in inches, if known. */
  widthIn?: number;
  heightIn?: number;
  offsetIn?: number;
}): Promise<CutPathResult> {
  const { buf, shape, fitMode, roundedCorners, removedBackground } = params;
  const offsetIn = params.offsetIn ?? DEFAULT_OFFSET_IN;

  const sharp = (await import("sharp")).default;
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) return { width: 0, height: 0, pathD: [], imageX: 0, imageY: 0, imageW: 0, imageH: 0, pxPerInch: DEFAULT_DPI_FALLBACK };

  const isEdge = fitMode === "edge" || shape === "die-cut";

  if (isEdge) {
    // Physical size for die-cut/edge mode follows the image's own aspect
    // ratio, "contained" within the customer's chosen bounding box (matches
    // the fitMode="edge" preview, which never crops).
    const pxPerInch = pxPerInchForContain(w, h, params.widthIn, params.heightIn);

    if (!removedBackground) {
      // No alpha to follow — the sticker boundary IS the image rectangle,
      // so there's no outward bleed offset to make room for.
      return { width: w, height: h, pathD: [`M 0 0 H ${w} V ${h} H 0 Z`], imageX: 0, imageY: 0, imageW: w, imageH: h, pxPerInch };
    }

    const { alpha } = await extractAlphaMask(buf);
    const contours = traceContours(alpha, w, h);
    if (!contours.length) {
      return { width: w, height: h, pathD: [`M 0 0 H ${w} V ${h} H 0 Z`], imageX: 0, imageY: 0, imageW: w, imageH: h, pxPerInch };
    }

    const offsetPx = offsetIn * pxPerInch;
    // The cutline sits OUTSIDE the traced artwork edge by offsetPx — the
    // canvas must grow by that same margin on every side, or the offset
    // path (and any real artwork already touching the image's own edge)
    // gets clipped by the canvas boundary. +1px slack absorbs the small
    // overshoot the round-join offset/simplify pass can introduce.
    const marginPx = Math.ceil(offsetPx) + 1;
    const canvasW = w + marginPx * 2;
    const canvasH = h + marginPx * 2;

    const pathD = contours.map((c) => {
      const simplified = simplifyContour(c, Math.max(1, pxPerInch * 0.01));
      const offset = offsetContour(simplified, offsetPx);
      const shifted = offset.map((p) => ({ x: p.x + marginPx, y: p.y + marginPx }));
      return polygonToPathD(shifted);
    });
    return { width: canvasW, height: canvasH, pathD, imageX: marginPx, imageY: marginPx, imageW: w, imageH: h, pxPerInch };
  }

  // Preset shapes (circle/oval/square/rectangle) — generated as exact
  // parametric geometry rather than traced, matching the raster proof's
  // math in app/api/proof/route.ts (always a "cover" crop into the shape).
  const sz = Math.min(w, h);
  const boxIn = params.widthIn ?? params.heightIn ?? sz / DEFAULT_DPI_FALLBACK;
  const pxPerInch = sz / boxIn;
  const offsetPx = offsetIn * pxPerInch;
  // The offset cutline sits outside the artwork's own box on every side —
  // same margin math as the edge/die-cut branch above, so it isn't clipped.
  const marginPx = Math.ceil(offsetPx) + 1;

  if (shape === "circle") {
    const canvasSz = sz + marginPx * 2;
    const r = sz / 2 + offsetPx;
    return {
      width: canvasSz, height: canvasSz,
      pathD: [circlePathD(canvasSz / 2, canvasSz / 2, r)],
      imageX: marginPx, imageY: marginPx, imageW: sz, imageH: sz, pxPerInch,
    };
  }
  if (shape === "oval") {
    const ow = Math.round(sz * 0.72), oh = sz;
    const canvasW = ow + marginPx * 2, canvasH = oh + marginPx * 2;
    const rx = ow / 2 + offsetPx, ry = oh / 2 + offsetPx;
    return {
      width: canvasW, height: canvasH,
      pathD: [ellipsePathD(canvasW / 2, canvasH / 2, rx, ry)],
      imageX: marginPx, imageY: marginPx, imageW: ow, imageH: oh, pxPerInch,
    };
  }
  if (shape === "square") {
    const canvasSz = sz + marginPx * 2;
    const rIn = sz * RC_FRACTION[roundedCorners];
    return {
      width: canvasSz, height: canvasSz,
      pathD: [roundedRectPathD(marginPx - offsetPx, marginPx - offsetPx, sz + 2 * offsetPx, sz + 2 * offsetPx, rIn + offsetPx)],
      imageX: marginPx, imageY: marginPx, imageW: sz, imageH: sz, pxPerInch,
    };
  }
  // rectangle
  const rw = Math.round(sz * 1.45), rh = sz;
  const canvasW = rw + marginPx * 2, canvasH = rh + marginPx * 2;
  const rIn = rh * RC_FRACTION[roundedCorners];
  return {
    width: canvasW, height: canvasH,
    pathD: [roundedRectPathD(marginPx - offsetPx, marginPx - offsetPx, rw + 2 * offsetPx, rh + 2 * offsetPx, rIn + offsetPx)],
    imageX: marginPx, imageY: marginPx, imageW: rw, imageH: rh, pxPerInch,
  };
}

function pxPerInchForContain(pxW: number, pxH: number, boxWIn?: number, boxHIn?: number): number {
  if (!boxWIn && !boxHIn) return DEFAULT_DPI_FALLBACK;
  const bw = boxWIn ?? boxHIn!;
  const bh = boxHIn ?? boxWIn!;
  // "contain" fit: the box dimension that binds first sets the scale.
  const scaleInPerPx = Math.min(bw / pxW, bh / pxH);
  return 1 / scaleInPerPx;
}

// ─── Output builders ────────────────────────────────────────────────────────

export function buildCutSvg(pngDataUri: string, cut: CutPathResult): string {
  const { width, height, imageX, imageY, imageW, imageH, pxPerInch, pathD } = cut;
  // Explicit physical units on width/height (not just viewBox numbers) —
  // without these, tools like Illustrator interpret the raw pixel count as
  // px-at-72dpi on import, so e.g. a 1200px-wide design opens as 16.7in.
  const widthIn = fmt(width / pxPerInch);
  const heightIn = fmt(height / pxPerInch);
  const paths = pathD
    .map((d) => `<path id="ContourCut" d="${d}" fill="none" stroke="#FF00FF" stroke-width="0.75" />`)
    .join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthIn}in" height="${heightIn}in" viewBox="0 0 ${width} ${height}">
  <image href="${pngDataUri}" x="${imageX}" y="${imageY}" width="${imageW}" height="${imageH}" />
  ${paths}
</svg>`;
}

export async function buildCutPdf(pngBuffer: Buffer, cut: CutPathResult): Promise<Buffer> {
  const { PDFDocument, rgb } = await import("pdf-lib");
  const { width, height, imageX, imageY, imageW, imageH, pxPerInch, pathD } = cut;

  // PDF page dimensions are in points (72/inch), not pixels — passing the
  // raw pixel canvas straight to addPage() was the cause of files opening
  // at the wrong physical size (e.g. a 1200px/300dpi, i.e. 4in, design
  // opening as 1200pt = 16.7in). Converting through pxPerInch fixes it.
  const scale = 72 / pxPerInch; // points per source pixel
  const pageW = width * scale;
  const pageH = height * scale;

  const doc = await PDFDocument.create();
  const page = doc.addPage([pageW, pageH]);
  const png = await doc.embedPng(pngBuffer);

  // Image-space Y grows downward from the top; PDF page space grows upward
  // from the bottom — flip when placing the artwork inset in the canvas.
  page.drawImage(png, {
    x: imageX * scale,
    y: (height - imageY - imageH) * scale,
    width: imageW * scale,
    height: imageH * scale,
  });

  // NOTE: this stroke is plain magenta (#FF00FF) — the conventional
  // "CutContour" preview color — not a true named spot-color separation.
  // Building a genuine Separation ink swatch requires raw PDF content-stream
  // construction that can't be verified against real Illustrator/RIP
  // software in this environment; per the client's own fallback, converting
  // this path into a proper CutContour swatch is a one-time Illustrator
  // action/script on import.
  for (const d of pathD) {
    // drawSvgPath's y-axis matches SVG (top-down); flip to PDF's bottom-up
    // page space by anchoring at the page's top, and let `scale` convert
    // the path's pixel-space coordinates into page points. borderWidth is
    // in the same (already-scaled) space, so divide to keep the printed
    // line weight ~0.75pt regardless of the source image's resolution.
    page.drawSvgPath(d, { x: 0, y: pageH, scale, borderColor: rgb(1, 0, 1), borderWidth: 0.75 / scale });
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
