import { NextRequest, NextResponse } from "next/server";
import { createDraftOrder } from "@/lib/shopify-admin";
import { getCurrentCustomer } from "@/lib/customer-session";
import type { CartItem } from "@/lib/cart-types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { items: CartItem[]; email?: string };
    const { items, email: guestEmail } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Try to get logged-in customer
    let customerId: string | null = null;
    let customerEmail: string | null = guestEmail ?? null;

    try {
      const customer = await getCurrentCustomer();
      if (customer) {
        customerId = customer.id;
        customerEmail = customer.email;
      }
    } catch {
      // not logged in — continue as guest
    }

    // Build Shopify line items
    const lineItems = items.map((item) => {
      if (item.kind === "product") {
        const allProps = { ...item.selectedOptions, ...item.extraProperties };
        return {
          variantId: item.variantId,
          quantity: item.qty,
          customAttributes: Object.entries(allProps)
            .filter(([, v]) => v && !v.startsWith("data:"))
            .map(([k, v]) => ({ key: k, value: v })),
        };
      }

      // Vinyl sticker — custom line item
      const attrs: { key: string; value: string }[] = [
        { key: "Shape",         value: item.shape },
        { key: "Material",      value: item.material },
        { key: "Size",          value: item.size },
        { key: "Quantity Tier", value: String(item.tierQty) },
      ];
      if (item.finish)       attrs.push({ key: "Finish",        value: item.finish });
      if (item.cutType)      attrs.push({ key: "Cut Type",      value: item.cutType });
      if (item.customWidth)  attrs.push({ key: "Custom Width",  value: `${item.customWidth} in` });
      if (item.customHeight) attrs.push({ key: "Custom Height", value: `${item.customHeight} in` });
      if (item.fileName)     attrs.push({ key: "Design File",   value: item.fileName });
      if (item.placement)    attrs.push({ key: "Window Placement", value: item.placement === "inside" ? "Inside (applied to inside of glass)" : "Outside (applied to outside of glass)" });

      // Design File URL — clean bg-removed image (no cutline overlay), for printing
      const designFileUrl = item.proof?.designUrl ?? item.fileUrl;
      if (designFileUrl && !designFileUrl.startsWith("data:")) {
        attrs.push({ key: "Design File URL", value: designFileUrl });
      }

      // Real vector cutline for the Graphtec cutter — separate from the
      // raster proof preview above.
      if (item.proof?.cutFileUrl) {
        attrs.push({ key: "Cut File (SVG)", value: item.proof.cutFileUrl });
      }
      if (item.proof?.productionPdfUrl) {
        attrs.push({ key: "Production File (PDF)", value: item.proof.productionPdfUrl });
      }

      if (item.proof) {
        attrs.push({ key: "Proof Shape",    value: item.proof.shape });
        attrs.push({ key: "Fit Mode",       value: item.proof.fitMode });
        if (item.proof.borderThickness) {
          attrs.push({ key: "Cutline Thickness", value: item.proof.borderThickness });
        }
        if (item.proof.roundedCorners && item.proof.roundedCorners !== "none") {
          attrs.push({ key: "Rounded Corners", value: item.proof.roundedCorners });
        }
        if (item.proof.cutlineColor) {
          attrs.push({ key: "Cutline Color", value: item.proof.cutlineColor });
        }
        if (item.proof.bgColor) {
          attrs.push({ key: "Background Color", value: item.proof.bgColor });
        }
        attrs.push({ key: "Background Removed", value: item.proof.removedBackground ? "Yes" : "No" });

        // Human-readable summary
        const parts: string[] = [];
        if (item.proof.shape)                                           parts.push(`shape: ${item.proof.shape}`);
        if (item.proof.fitMode)                                         parts.push(`mode: ${item.proof.fitMode}`);
        if (item.proof.borderThickness)                                 parts.push(`cutline: ${item.proof.borderThickness}`);
        if (item.proof.cutlineColor)                                    parts.push(`cutline color: ${item.proof.cutlineColor}`);
        if (item.proof.roundedCorners && item.proof.roundedCorners !== "none") parts.push(`corners: ${item.proof.roundedCorners}`);
        if (item.proof.bgColor)                                         parts.push(`bg: ${item.proof.bgColor}`);
        if (item.proof.removedBackground)                               parts.push("bg removed");
        if (parts.length) attrs.push({ key: "Design Settings", value: parts.join(" · ") });
      }

      if (item.instructions) attrs.push({ key: "Instructions", value: item.instructions });
      if (item.proof?.changeNote) attrs.push({ key: "Customer Note", value: item.proof.changeNote });

      return {
        title: item.title,
        quantity: item.tierQty,
        originalUnitPrice: item.perUnit.toFixed(2),
        requiresShipping: true,
        customAttributes: attrs,
      };
    });

    const note = items
      .filter((i) => i.kind === "vinyl-sticker" && i.instructions)
      .map((i) => (i as { instructions?: string }).instructions)
      .filter(Boolean)
      .join("\n");

    const draftOrder = await createDraftOrder({
      lineItems,
      customerId,
      email: customerEmail,
      note: note || undefined,
    });

    return NextResponse.json({
      draftOrderId: draftOrder.id,
      name: draftOrder.name,
      invoiceUrl: draftOrder.invoiceUrl,
    });
  } catch (err) {
    console.error("[/api/checkout/create]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
