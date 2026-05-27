import { unstable_cache } from "next/cache";
import { shopifyStorefrontFetch } from "./shopify-storefront";

export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  price: string;
  currencyCode: string;
  compareAtPrice: string | null;
  availableForSale: boolean;
  sku: string | null;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
};

export type ShopifyOption = {
  id: string;
  name: string;
  values: string[];
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  options: ShopifyOption[];
  variants: ShopifyVariant[];
};

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      featuredImage { url altText }
      images(first: 20) {
        nodes { url altText }
      }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          sku
          selectedOptions { name value }
          image { url altText }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
        }
      }
    }
  }
`;

type RawVariantNode = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku: string | null;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
};

type RawProductResp = {
  product: {
    id: string;
    handle: string;
    title: string;
    descriptionHtml: string;
    featuredImage: ShopifyImage | null;
    images: { nodes: ShopifyImage[] };
    options: Array<{ id: string; name: string; values: string[] }>;
    variants: { nodes: RawVariantNode[] };
  } | null;
};

async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyStorefrontFetch<RawProductResp>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle },
    { tags: [`product:${handle}`], revalidate: 300 },
  );

  const p = data.product;
  if (!p) return null;

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.descriptionHtml,
    featuredImage: p.featuredImage,
    images: p.images.nodes,
    options: p.options,
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      price: v.price.amount,
      currencyCode: v.price.currencyCode,
      compareAtPrice: v.compareAtPrice?.amount ?? null,
      availableForSale: v.availableForSale,
      sku: v.sku,
      selectedOptions: v.selectedOptions,
      image: v.image,
    })),
  };
}

export const getProductByHandle = unstable_cache(
  fetchProductByHandle,
  ["sv-product-by-handle"],
  { revalidate: 300, tags: ["products:all"] },
);

export function getMinVariantPrice(product: ShopifyProduct): {
  amount: string;
  currencyCode: string;
} | null {
  const candidates = product.variants.filter((v) => v.availableForSale);
  const pool = candidates.length > 0 ? candidates : product.variants;
  if (pool.length === 0) return null;
  const min = pool.reduce((a, b) => (Number(a.price) <= Number(b.price) ? a : b));
  return { amount: min.price, currencyCode: min.currencyCode };
}

export function isStickerProduct(product: ShopifyProduct): boolean {
  const text = `${product.title} ${product.handle}`.toLowerCase();
  return (
    text.includes("sticker") ||
    text.includes("holographic") ||
    text.includes("die-cut") ||
    text.includes("die cut") ||
    text.includes("vinyl") ||
    text.includes("decal")
  );
}
