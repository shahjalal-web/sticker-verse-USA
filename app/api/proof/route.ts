import { NextRequest, NextResponse } from "next/server";
import { uploadFileToShopify } from "@/lib/shopify-admin";
import { buildCutPath, buildCutSvg, buildCutPdf, type CutShape, type CutFitMode, type CutRoundedCorners } from "@/lib/cut-path";

export const runtime = "nodejs";
export const maxDuration = 60;

type ShapeId = "die-cut" | "circle" | "oval" | "square" | "rectangle";
type FitMode = "fill" | "fit" | "edge";
type BorderThickness = "thin" | "normal" | "wide";
type RoundedCorners = "none" | "soft" | "medium" | "heavy";

const BLUR_MAP: Record<BorderThickness, number> = { thin: 3, normal: 6, wide: 12 };
const BPX_MAP: Record<BorderThickness, number> = { thin: 6, normal: 12, wide: 20 };
const RC_MAP: Record<RoundedCorners, number> = { none: 0, soft: 0.045, medium: 0.11, heavy: 0.27 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function makeDieCut(buf: Buffer, blur: number, sharp: any, w: number, h: number): Promise<Buffer> {
  const rawData = await sharp(buf).ensureAlpha().raw().toBuffer();
  const alphaOnly = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) alphaOnly[i] = rawData[i * 4 + 3];

  const dilatedAlpha = await sharp(alphaOnly, { raw: { width: w, height: h, channels: 1 } })
    .blur(blur)
    .threshold(8)
    .toBuffer();

  const greenLayer = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    greenLayer[i * 4 + 0] = 0;
    greenLayer[i * 4 + 1] = 255;
    greenLayer[i * 4 + 2] = 68;
    greenLayer[i * 4 + 3] = dilatedAlpha[i];
  }

  return sharp(greenLayer, { raw: { width: w, height: h, channels: 4 } })
    .composite([{ input: buf, blend: "over" }])
    .png()
    .toBuffer();
}

async function generateProof(
  buf: Buffer,
  shape: ShapeId,
  fitMode: FitMode,
  borderThickness: BorderThickness,
  roundedCorners: RoundedCorners,
  removedBackground: boolean,
): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) return buf;

  if (fitMode === "edge") {
    if (!removedBackground) {
      // No alpha channel to follow — add a rectangular border to show the cut boundary
      const b2 = BPX_MAP[borderThickness];
      const half = b2 / 2;
      const svgBorder = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="${half}" y="${half}" width="${w - b2}" height="${h - b2}" fill="none" stroke="#00ff44" stroke-width="${b2}"/></svg>`,
      );
      return sharp(buf).composite([{ input: svgBorder, blend: "over" }]).png().toBuffer();
    }
    return makeDieCut(buf, BLUR_MAP[borderThickness], sharp, w, h);
  }

  const b = BPX_MAP[borderThickness];

  if (shape === "circle") {
    const sz = Math.min(w, h);
    const r = sz / 2;
    const svgMask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`,
    );
    const svgLine = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}"><circle cx="${r}" cy="${r}" r="${r - b / 2}" fill="none" stroke="#00ff44" stroke-width="${b}"/></svg>`,
    );
    const masked = await sharp(buf).resize(sz, sz, { fit: "cover" }).composite([{ input: svgMask, blend: "dest-in" }]).png().toBuffer();
    return sharp(masked).composite([{ input: svgLine, blend: "over" }]).png().toBuffer();
  }

  if (shape === "oval") {
    const sz = Math.min(w, h);
    const ow = Math.round(sz * 0.72);
    const oh = sz;
    const rx = ow / 2;
    const ry = oh / 2;
    const svgMask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${ow}" height="${oh}"><ellipse cx="${rx}" cy="${ry}" rx="${rx}" ry="${ry}" fill="white"/></svg>`,
    );
    const svgLine = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${ow}" height="${oh}"><ellipse cx="${rx}" cy="${ry}" rx="${rx - b / 2}" ry="${ry - b / 2}" fill="none" stroke="#00ff44" stroke-width="${b}"/></svg>`,
    );
    const masked = await sharp(buf).resize(ow, oh, { fit: "cover" }).composite([{ input: svgMask, blend: "dest-in" }]).png().toBuffer();
    return sharp(masked).composite([{ input: svgLine, blend: "over" }]).png().toBuffer();
  }

  if (shape === "square") {
    const sz = Math.min(w, h);
    const rx = Math.round(sz * RC_MAP[roundedCorners]);
    const half = b / 2;
    const svgMask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}"><rect width="${sz}" height="${sz}" rx="${rx}" fill="white"/></svg>`,
    );
    const svgLine = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}"><rect x="${half}" y="${half}" width="${sz - b}" height="${sz - b}" rx="${Math.max(0, rx - half)}" fill="none" stroke="#00ff44" stroke-width="${b}"/></svg>`,
    );
    const masked = await sharp(buf).resize(sz, sz, { fit: "cover" }).composite([{ input: svgMask, blend: "dest-in" }]).png().toBuffer();
    return sharp(masked).composite([{ input: svgLine, blend: "over" }]).png().toBuffer();
  }

  if (shape === "rectangle") {
    const sz = Math.min(w, h);
    const rw = Math.round(sz * 1.45);
    const rh = sz;
    const rx = Math.round(rh * RC_MAP[roundedCorners]);
    const half = b / 2;
    const svgMask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${rw}" height="${rh}"><rect width="${rw}" height="${rh}" rx="${rx}" fill="white"/></svg>`,
    );
    const svgLine = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${rw}" height="${rh}"><rect x="${half}" y="${half}" width="${rw - b}" height="${rh - b}" rx="${Math.max(0, rx - half)}" fill="none" stroke="#00ff44" stroke-width="${b}"/></svg>`,
    );
    const masked = await sharp(buf).resize(rw, rh, { fit: "cover" }).composite([{ input: svgMask, blend: "dest-in" }]).png().toBuffer();
    return sharp(masked).composite([{ input: svgLine, blend: "over" }]).png().toBuffer();
  }

  // die-cut fallback (fill/fit mode)
  if (!removedBackground) {
    const bFall = BPX_MAP[borderThickness];
    const halfFall = bFall / 2;
    const svgBorderFall = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="${halfFall}" y="${halfFall}" width="${w - bFall}" height="${h - bFall}" fill="none" stroke="#00ff44" stroke-width="${bFall}"/></svg>`,
    );
    return sharp(buf).composite([{ input: svgBorderFall, blend: "over" }]).png().toBuffer();
  }
  return makeDieCut(buf, BLUR_MAP[borderThickness], sharp, w, h);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const shape = ((formData.get("shape") as string) || "die-cut") as ShapeId;
    const fitMode = ((formData.get("fitMode") as string) || "edge") as FitMode;
    const borderThickness = ((formData.get("borderThickness") as string) || "normal") as BorderThickness;
    const roundedCorners = ((formData.get("roundedCorners") as string) || "none") as RoundedCorners;
    const removedBackground = formData.get("removedBackground") === "true";
    const fileName = (formData.get("fileName") as string) || "sticker.png";
    const widthIn = parseFloat((formData.get("widthIn") as string) || "") || undefined;
    const heightIn = parseFloat((formData.get("heightIn") as string) || "") || undefined;
    // Products not cut to the artwork's shape (banners, laser engraving, ...)
    // skip both the raster cutline-outline preview and the vector cut file.
    const skipCutline = formData.get("skipCutline") === "true";

    const buf = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "image/png";
    const baseName = fileName.replace(/\.[^.]+$/, "");

    let shopifyUrl: string | null = null;
    let designUrl: string | null = null;
    let cutFileUrl: string | null = null;
    let productionPdfUrl: string | null = null;

    if (mime.startsWith("image/") && mime !== "image/svg+xml") {
      const sharpLib = (await import("sharp")).default;

      let proofBuf: Buffer = buf;
      if (!skipCutline) {
        try {
          proofBuf = await generateProof(buf, shape, fitMode, borderThickness, roundedCorners, removedBackground);
        } catch { /* use raw buf as fallback */ }
      }

      // Composite proof over white background so the cutline is clearly visible
      // in Shopify admin (Shopify renders transparent PNGs as gray, hiding the cutline)
      let proofForAdmin = proofBuf;
      try {
        const { width: pw = 0, height: ph = 0 } = await sharpLib(proofBuf).metadata();
        if (pw && ph) {
          proofForAdmin = await sharpLib({
            create: { width: pw, height: ph, channels: 3, background: { r: 255, g: 255, b: 255 } },
          })
            .png()
            .composite([{ input: proofBuf, blend: "over" }])
            .toBuffer();
        }
      } catch { /* use proofBuf as-is */ }

      [designUrl, shopifyUrl] = await Promise.all([
        uploadFileToShopify(buf, `${baseName}_design.png`, "image/png").catch(() => null),
        uploadFileToShopify(proofForAdmin, `${baseName}_${shape}_proof.png`, "image/png").catch(() => null),
      ]);

      // Production cut path — the real vector cutline for the Graphtec
      // cutter, separate from the raster preview above. Best-effort: a
      // failure here must never block proof approval. Skipped for products
      // that aren't cut to the artwork's shape (banners, laser engraving, ...).
      if (!skipCutline) {
        try {
          const cut = await buildCutPath({
            buf,
            shape: shape as CutShape,
            fitMode: fitMode as CutFitMode,
            roundedCorners: roundedCorners as CutRoundedCorners,
            removedBackground,
            widthIn,
            heightIn,
          });
          if (cut.pathD.length && cut.width && cut.height) {
            const pngDataUri = `data:image/png;base64,${buf.toString("base64")}`;
            const svg = buildCutSvg(pngDataUri, cut.width, cut.height, cut.pathD);
            const pdfBuf = await buildCutPdf(buf, cut.width, cut.height, cut.pathD);
            [cutFileUrl, productionPdfUrl] = await Promise.all([
              uploadFileToShopify(Buffer.from(svg, "utf-8"), `${baseName}_${shape}_cutline.svg`, "image/svg+xml").catch((e) => { console.error("[/api/proof] cutFile upload failed", e); return null; }),
              uploadFileToShopify(pdfBuf, `${baseName}_${shape}_cutline.pdf`, "application/pdf").catch((e) => { console.error("[/api/proof] productionPdf upload failed", e); return null; }),
            ]);
          }
        } catch (err) {
          // non-fatal — proof still stands without a production cut file
          console.error("[/api/proof] cut-path generation failed", err);
        }
      }
    } else {
      try {
        const ext = fileName.match(/\.[^.]+$/)?.[0] ?? "";
        shopifyUrl = await uploadFileToShopify(buf, `${baseName}_proof${ext}`, mime);
        designUrl = shopifyUrl;
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ shopifyUrl, designUrl, cutFileUrl, productionPdfUrl });
  } catch (err) {
    console.error("[/api/proof]", err);
    return NextResponse.json({ error: "Proof generation failed" }, { status: 500 });
  }
}
