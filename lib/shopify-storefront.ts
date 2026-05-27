export const SHOPIFY_API_VERSION = "2026-04";

export class ShopifyError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type FetchOptions = {
  tags?: string[];
  revalidate?: number | false;
};

export async function shopifyStorefrontFetch<T>(
  query: string,
  variables: object = {},
  opts: FetchOptions = {},
): Promise<T> {
  const STORE = process.env.SHOPIFY_STORE_DOMAIN;
  const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

  if (!STORE || !TOKEN) {
    throw new ShopifyError(
      "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_TOKEN env vars",
      500,
    );
  }

  const next: { tags?: string[]; revalidate?: number | false } = {};
  if (opts.tags) next.tags = opts.tags;
  if (opts.revalidate !== undefined) next.revalidate = opts.revalidate;

  const resp = await fetch(
    `https://${STORE}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      next,
    },
  );

  if (!resp.ok) {
    const text = await resp.text();
    throw new ShopifyError(`Shopify Storefront HTTP ${resp.status}`, resp.status, text.slice(0, 500));
  }

  const json = (await resp.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new ShopifyError(json.errors[0]?.message ?? "Shopify Storefront error", 502, json.errors);
  }
  if (!json.data) {
    throw new ShopifyError("Shopify Storefront returned no data", 502);
  }
  return json.data;
}

export { shopifyStorefrontFetch as storefrontFetch };
