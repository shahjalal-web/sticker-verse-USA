import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// If the customer's file already has real transparency (a design already
// cut out in Illustrator/Photoshop), it doesn't need remove.bg at all —
// running photo-background AI on already-clean art is what was shredding
// white letters/shapes that were meant to stay. >2% non-opaque pixels is
// enough to distinguish "already cut out" from a stray anti-aliased edge
// or an unused alpha channel on a fully-opaque PNG.
async function hasExistingTransparency(buf: Buffer): Promise<boolean> {
  try {
    const sharp = (await import("sharp")).default;
    const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;
    const total = width * height;
    if (!total) return false;
    let transparent = 0;
    for (let i = 0; i < total; i++) {
      if (data[i * channels + (channels - 1)] < 250) transparent++;
    }
    return transparent / total > 0.02;
  } catch {
    return false;
  }
}

// remove.bg's segmentation punches out ANY region it thinks looks like
// background, including white/light shapes fully enclosed inside the
// design (a white star inside a colored badge, the inside of a letter,
// etc). Real background always touches the image border; a transparent
// region that does NOT connect to the border through other transparent
// pixels is, with very high confidence, a misclassified piece of the
// design — not background — so restore it from the original pixels.
// (This costs the rare deliberately-punched hole, like the inside of an
// "O"; the customer-facing before/after toggle in the proof UI is the
// backstop for that case.)
async function restoreEnclosedIslands(removedBuf: Buffer, originalBuf: Buffer): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const { data: rgba, info } = await sharp(removedBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (!width || !height) return removedBuf;

  const { data: orig } = await sharp(originalBuf)
    .resize(width, height, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ALPHA_THRESHOLD = 128;
  const total = width * height;
  const isTransparent = (idx: number) => rgba[idx * channels + 3] < ALPHA_THRESHOLD;

  // BFS from every transparent border pixel — everything it reaches
  // (through other transparent pixels) is real, border-connected background.
  const reached = new Uint8Array(total);
  const queue = new Int32Array(total);
  let qHead = 0;
  let qTail = 0;

  const tryEnqueue = (x: number, y: number) => {
    const idx = y * width + x;
    if (reached[idx] || !isTransparent(idx)) return;
    reached[idx] = 1;
    queue[qTail++] = idx;
  };

  for (let x = 0; x < width; x++) { tryEnqueue(x, 0); tryEnqueue(x, height - 1); }
  for (let y = 0; y < height; y++) { tryEnqueue(0, y); tryEnqueue(width - 1, y); }

  while (qHead < qTail) {
    const idx = queue[qHead++];
    const x = idx % width;
    const y = (idx / width) | 0;
    if (x > 0) tryEnqueue(x - 1, y);
    if (x < width - 1) tryEnqueue(x + 1, y);
    if (y > 0) tryEnqueue(x, y - 1);
    if (y < height - 1) tryEnqueue(x, y + 1);
  }

  let restoredCount = 0;
  for (let i = 0; i < total; i++) {
    if (isTransparent(i) && !reached[i]) {
      const o = i * channels;
      rgba[o] = orig[o];
      rgba[o + 1] = orig[o + 1];
      rgba[o + 2] = orig[o + 2];
      rgba[o + 3] = 255;
      restoredCount++;
    }
  }

  if (!restoredCount) return removedBuf;
  return sharp(rgba, { raw: { width, height, channels } }).png().toBuffer();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ALLOWED = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "application/pdf"];
    if (!ALLOWED.includes(file.type))
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    if (file.size > 25 * 1024 * 1024)
      return NextResponse.json({ error: "File too large (max 25 MB)" }, { status: 400 });

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    let processedUrl: string | null = null;
    let removedBackground = false;

    if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      const KEY = process.env.REMOVE_BG_API_KEY;
      const alreadyTransparent = KEY ? await hasExistingTransparency(fileBuffer) : false;
      if (KEY && !alreadyTransparent) {
        try {
          const bgForm = new FormData();
          bgForm.append("image_file", new Blob([fileBuffer], { type: file.type }), file.name);
          bgForm.append("size", "auto");
          // "graphic" tells remove.bg this is flat illustration/design art
          // rather than a photo — "auto" was tuned for photographic subjects
          // (people/products/cars) and was misreading deliberate white design
          // elements as background, stripping them out of the proof.
          bgForm.append("type", "graphic");

          const bgResp = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: { "X-Api-Key": KEY },
            body: bgForm,
          });

          if (bgResp.ok) {
            let bgRemovedBuffer = Buffer.from(await bgResp.arrayBuffer());
            try {
              bgRemovedBuffer = Buffer.from(await restoreEnclosedIslands(bgRemovedBuffer, fileBuffer));
            } catch { /* use remove.bg's raw result as-is */ }
            processedUrl = `data:image/png;base64,${bgRemovedBuffer.toString("base64")}`;
            removedBackground = true;
          }
        } catch {
          // fall through — no bg removal
        }
      } else if (alreadyTransparent) {
        // Already cut out — client's own object URL (the original) is the
        // correct image to show; just flag it as having a usable alpha
        // channel so the cutline traces the real artwork silhouette.
        removedBackground = true;
      }
    }

    // Return only processedUrl (null if no bg removal — client uses its own object URL for original)
    return NextResponse.json({ processedUrl, removedBackground });
  } catch (err) {
    console.error("[/api/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
