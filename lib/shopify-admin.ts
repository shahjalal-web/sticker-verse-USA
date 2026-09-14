const SHOPIFY_API_VERSION = "2026-04";

async function shopifyAdminFetch<T>(query: string, variables: object = {}): Promise<T> {
  const STORE = process.env.SHOPIFY_STORE_DOMAIN;
  const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!STORE || !TOKEN) throw new Error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN");

  const resp = await fetch(`https://${STORE}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Shopify Admin HTTP ${resp.status}: ${text.slice(0, 400)}`);
  }

  const json = (await resp.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  if (!json.data) throw new Error("Shopify Admin returned no data");
  return json.data;
}

export interface DraftLineItem {
  title?: string;
  quantity: number;
  originalUnitPrice?: string;
  requiresShipping?: boolean;
  variantId?: string;
  customAttributes?: { key: string; value: string }[];
}

export async function createDraftOrder({
  lineItems,
  customerId,
  email,
  note,
}: {
  lineItems: DraftLineItem[];
  customerId?: string | null;
  email?: string | null;
  note?: string;
}) {
  const query = `
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder { id name invoiceUrl totalPrice }
        userErrors { field message }
      }
    }
  `;

  type Resp = {
    draftOrderCreate: {
      draftOrder: { id: string; name: string; invoiceUrl: string; totalPrice: string } | null;
      userErrors: { field: string; message: string }[];
    };
  };

  const input: Record<string, unknown> = {
    lineItems: lineItems.map((item) => {
      if (item.variantId) {
        return {
          variantId: item.variantId,
          quantity: item.quantity,
          ...(item.customAttributes?.length ? { customAttributes: item.customAttributes } : {}),
        };
      }
      return {
        title: item.title,
        quantity: item.quantity,
        originalUnitPrice: item.originalUnitPrice ?? "0.00",
        requiresShipping: item.requiresShipping ?? true,
        ...(item.customAttributes?.length ? { customAttributes: item.customAttributes } : {}),
      };
    }),
  };

  if (customerId) input.customerId = customerId;
  if (email) input.email = email;
  if (note) input.note = note;

  const data = await shopifyAdminFetch<Resp>(query, { input });

  const errors = data.draftOrderCreate.userErrors;
  if (errors.length > 0) throw new Error(errors[0].message);

  const order = data.draftOrderCreate.draftOrder;
  if (!order) throw new Error("Draft order creation returned no data");
  return order;
}

// Shopify's file-processing pipeline (or the network hop to it) occasionally
// has a one-off hiccup — retrying the same request once, after a short delay,
// clears the vast majority of these without the caller ever noticing.
async function fetchWithRetry(url: string, init: RequestInit, attempts = 2): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const resp = await fetch(url, init);
      if (resp.ok) return resp;
      lastErr = new Error(`HTTP ${resp.status}`);
    } catch (err) {
      lastErr = err;
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 600));
  }
  throw lastErr;
}

export async function uploadFileToShopify(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<string | null> {
  const STORE = process.env.SHOPIFY_STORE_DOMAIN!;
  const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN!;
  const base = `https://${STORE}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const headers = { "X-Shopify-Access-Token": TOKEN, "Content-Type": "application/json" };

  // 1. Stage the upload
  const stageResp = await fetchWithRetry(base, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets { url resourceUrl parameters { name value } }
            userErrors { message }
          }
        }
      `,
      variables: {
        input: [{ resource: "FILE", filename, mimeType, httpMethod: "POST", fileSize: String(buffer.length) }],
      },
    }),
    cache: "no-store",
  });

  const stageJson = (await stageResp.json()) as {
    data?: { stagedUploadsCreate: { stagedTargets: { url: string; resourceUrl: string; parameters: { name: string; value: string }[] }[] } };
  };
  const target = stageJson.data?.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target) return null;

  // 2. Upload file
  const form = new FormData();
  for (const p of target.parameters) form.append(p.name, p.value);
  form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
  const upResp = await fetchWithRetry(target.url, { method: "POST", body: form }).catch(() => null);
  if (!upResp || !upResp.ok) return null;

  // 3. Create file in Shopify — get file ID
  // contentType must match the resource: images become a MediaImage (with a
  // processed `image.url`), everything else (PDF, SVG, ...) must be "FILE"
  // or Shopify creates a broken/empty node.
  const shopifyContentType = mimeType.startsWith("image/") && mimeType !== "image/svg+xml" ? "IMAGE" : "FILE";
  const createResp = await fetchWithRetry(base, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        mutation fileCreate($files: [FileCreateInput!]!) {
          fileCreate(files: $files) {
            files {
              id
              fileStatus
              ... on MediaImage { image { url } }
              ... on GenericFile { url }
            }
            userErrors { message }
          }
        }
      `,
      variables: { files: [{ originalSource: target.resourceUrl, contentType: shopifyContentType }] },
    }),
    cache: "no-store",
  });

  const createJson = (await createResp.json()) as {
    data?: {
      fileCreate: {
        files: { id: string; fileStatus: string; image?: { url: string }; url?: string }[];
        userErrors: { message: string }[];
      };
    };
  };

  const created = createJson.data?.fileCreate?.files?.[0];
  // If file creation failed entirely, fall back to the staging resourceUrl which
  // is publicly readable right after the upload above (valid for ~48 h).
  if (!created) return target.resourceUrl;

  // If URL is immediately available (already READY), return it
  const immediateUrl = created.image?.url ?? created.url;
  if (immediateUrl) return immediateUrl;

  // 4. Poll until READY (max 6 × 1.5s = 9s — kept short so a slow file never
  // eats into the request's overall time budget; the resourceUrl fallback
  // below is a fully working link either way, just not the final CDN one).
  const fileId = created.id;
  // If no fileId, fall back to staging URL
  if (!fileId) return target.resourceUrl;

  for (let i = 0; i < 6; i++) {
    await new Promise((r) => setTimeout(r, 1500));

    // A transient blip on a single poll must not throw away the fallback
    // below — just skip this attempt and try again next tick.
    try {
      const pollResp = await fetch(base, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `
            query getFile($id: ID!) {
              node(id: $id) {
                ... on MediaImage { fileStatus image { url } }
                ... on GenericFile  { fileStatus url }
              }
            }
          `,
          variables: { id: fileId },
        }),
        cache: "no-store",
      });

      const pollJson = (await pollResp.json()) as {
        data?: { node: { fileStatus: string; image?: { url: string }; url?: string } | null };
      };

      const node = pollJson.data?.node;
      if (node?.fileStatus === "READY") {
        return node.image?.url ?? node.url ?? null;
      }
    } catch { /* try again next tick */ }
  }

  // Shopify CDN URL not ready within polling window — return staging URL as fallback.
  // This is publicly accessible for ~48 h which is enough for the admin to act on the order.
  return target.resourceUrl;
}
