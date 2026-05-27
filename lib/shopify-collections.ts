import { unstable_cache } from "next/cache";
import { shopifyStorefrontFetch as storefrontFetch } from "./shopify-storefront";

export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifyCollectionSummary = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
};

export type ShopifyCollectionProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ShopifyImage | null;
  minPrice: string | null;
  currencyCode: string | null;
};

export type ShopifyCollectionDetail = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: ShopifyCollectionProduct[];
};

const ALL_COLLECTIONS_QUERY = `
  query GetAllCollections {
    collections(first: 50, sortKey: TITLE) {
      nodes {
        id
        handle
        title
        description
        image { url altText }
      }
    }
  }
`;

type RawAllCollectionsResp = {
  collections: {
    nodes: Array<{
      id: string;
      handle: string;
      title: string;
      description: string;
      image: ShopifyImage | null;
    }>;
  };
};

const SYSTEM_HANDLES = new Set(["frontpage", "home-page", "homepage", "uncategorized", "all"]);

function isSystemCollection(handle: string, title: string): boolean {
  if (SYSTEM_HANDLES.has(handle.toLowerCase())) return true;
  if (/^avada\b/i.test(title.trim())) return true;
  return false;
}

async function fetchAllCollections(): Promise<ShopifyCollectionSummary[]> {
  const data = await storefrontFetch<RawAllCollectionsResp>(
    ALL_COLLECTIONS_QUERY,
    {},
    { tags: ["collections:all"], revalidate: 300 },
  );

  return data.collections.nodes
    .filter((c) => !isSystemCollection(c.handle, c.title))
    .map((c) => ({
      id: c.id,
      handle: c.handle,
      title: c.title,
      description: c.description ?? "",
      image: c.image,
    }));
}

export const getAllCollections = unstable_cache(
  fetchAllCollections,
  ["sv-all-collections"],
  { revalidate: 300, tags: ["collections:all"] },
);

const COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { url altText }
      products(first: 100) {
        nodes {
          id
          handle
          title
          description
          featuredImage { url altText }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
        }
      }
    }
  }
`;

type RawCollectionByHandleResp = {
  collection: {
    id: string;
    handle: string;
    title: string;
    description: string;
    image: ShopifyImage | null;
    products: {
      nodes: Array<{
        id: string;
        handle: string;
        title: string;
        description: string;
        featuredImage: ShopifyImage | null;
        priceRange: {
          minVariantPrice: { amount: string; currencyCode: string } | null;
        } | null;
      }>;
    };
  } | null;
};

async function fetchCollectionByHandle(handle: string): Promise<ShopifyCollectionDetail | null> {
  const data = await storefrontFetch<RawCollectionByHandleResp>(
    COLLECTION_BY_HANDLE_QUERY,
    { handle },
    { tags: [`collection:${handle}`], revalidate: 300 },
  );

  const c = data.collection;
  if (!c) return null;

  return {
    id: c.id,
    handle: c.handle,
    title: c.title,
    description: c.description ?? "",
    image: c.image,
    products: c.products.nodes.map((p) => {
      const min = p.priceRange?.minVariantPrice ?? null;
      const hasRealPrice = !!min && Number(min.amount) > 0;
      return {
        id: p.id,
        handle: p.handle,
        title: p.title,
        description: p.description ?? "",
        featuredImage: p.featuredImage,
        minPrice: hasRealPrice ? min.amount : null,
        currencyCode: hasRealPrice ? min.currencyCode : null,
      };
    }),
  };
}

export const getCollectionByHandle = unstable_cache(
  fetchCollectionByHandle,
  ["sv-collection-by-handle"],
  { revalidate: 300, tags: ["collections:all"] },
);
