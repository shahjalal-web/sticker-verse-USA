import {
  PRICING,
  POPULAR_PRICING,
  SHEET_CUT_SURCHARGE,
  type QtyBreak,
  type SizeTables,
} from "./pricing-data";

export type CutType = "contour" | "kiss";

export type ProductId =
  | "premium-vinyl"
  | "economy-vinyl"
  | "holographic"
  | "chrome"
  | "glitter"
  | "clear"
  | "qr-vinyl"
  | "qr-holographic"
  | "sheets"
  | "easy-peel"
  | "static-cling";

export const MIN_QTY = 15;
export const QTY_PRESETS = [50, 100, 200, 300, 500, 1000, 3000];

/** Popular size pills shown when Custom Size is selected ("5.5" = 5.5" × 5.5"). */
export const POPULAR_SIZES: { key: string; label: string; w: number; h: number }[] = [
  { key: "3x2", label: '3" × 2"', w: 3, h: 2 },
  { key: "4x3", label: '4" × 3"', w: 4, h: 3 },
  { key: "5.5", label: '5.5"', w: 5.5, h: 5.5 },
  { key: "11x3", label: '11" × 3"', w: 11, h: 3 },
];

function areaOf(sizeKey: string): number {
  const nums = sizeKey.split("x").map(Number);
  return nums.length === 2 ? nums[0] * nums[1] : nums[0] * nums[0];
}

function tierPrice(table: QtyBreak[], qty: number): number {
  let price = table[0].price;
  for (const t of table) {
    if (qty >= t.qty) price = t.price;
    else break;
  }
  return price;
}

function tablesFor(product: ProductId): SizeTables {
  const base = PRICING[product] ?? {};
  const popular = POPULAR_PRICING[product] ?? {};
  return { ...popular, ...base };
}

type Anchor = { area: number; table: QtyBreak[] };

function anchorsFor(product: ProductId, cut: CutType): Anchor[] {
  const tables = tablesFor(product);
  const anchors: Anchor[] = [];
  for (const [sizeKey, cuts] of Object.entries(tables)) {
    const table = cut === "kiss" ? cuts.kiss ?? cuts.contour : cuts.contour;
    if (table?.length) anchors.push({ area: areaOf(sizeKey), table });
  }
  anchors.sort((a, b) => a.area - b.area);
  return anchors;
}

/**
 * Per-sticker price for any size. Exact sheet sizes hit their table directly;
 * in-between sizes interpolate linearly by area between the two nearest tables.
 */
export function unitPrice(
  product: ProductId,
  cut: CutType,
  widthIn: number,
  heightIn: number,
  qty: number
): number {
  const q = Math.max(MIN_QTY, Math.floor(qty) || MIN_QTY);
  const anchors = anchorsFor(product, cut);
  if (!anchors.length) return 0;

  const area = Math.max(0.25, widthIn * heightIn);

  if (area <= anchors[0].area) return tierPrice(anchors[0].table, q);

  const last = anchors[anchors.length - 1];
  if (area >= last.area) {
    if (anchors.length === 1) return tierPrice(last.table, q);
    // extrapolate from the slope of the two largest anchors
    const prev = anchors[anchors.length - 2];
    const pLast = tierPrice(last.table, q);
    const pPrev = tierPrice(prev.table, q);
    const slope = Math.max(0, (pLast - pPrev) / (last.area - prev.area));
    return round2(pLast + slope * (area - last.area));
  }

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (area >= a.area && area <= b.area) {
      const pa = tierPrice(a.table, q);
      const pb = tierPrice(b.table, q);
      const t = (area - a.area) / (b.area - a.area);
      return round2(pa + (pb - pa) * t);
    }
  }
  return tierPrice(last.table, q);
}

/** Order total in USD. `sheetCuts` applies the sticker-sheet cut surcharge. */
export function orderTotal(
  product: ProductId,
  cut: CutType,
  widthIn: number,
  heightIn: number,
  qty: number,
  sheetCuts?: number
): number {
  let unit = unitPrice(product, cut, widthIn, heightIn, qty);
  if (product === "sheets" && sheetCuts) {
    for (const s of SHEET_CUT_SURCHARGE) {
      if (sheetCuts <= s.maxCuts) {
        unit = unit * (1 + s.pct);
        break;
      }
    }
  }
  return round2(unit * Math.max(MIN_QTY, qty));
}

/** "Save 35%" style discount vs. the smallest preset quantity (50). */
export function savePct(
  product: ProductId,
  cut: CutType,
  widthIn: number,
  heightIn: number,
  qty: number
): number {
  const base = unitPrice(product, cut, widthIn, heightIn, QTY_PRESETS[0]);
  const now = unitPrice(product, cut, widthIn, heightIn, qty);
  if (!base || now >= base) return 0;
  return Math.round((1 - now / base) * 100);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
