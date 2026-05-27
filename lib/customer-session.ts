import { cache } from "react";
import { cookies } from "next/headers";
import { shopifyStorefrontFetch } from "./shopify-storefront";

export const SESSION_COOKIE = "sv_customer";

export type CustomerSession = {
  token: string;
  expiresAt: string;
};

export type CurrentCustomer = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  displayName: string;
};

export type CustomerOrder = {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: { amount: string; currencyCode: string };
  statusUrl: string;
  lineItems: Array<{ title: string; quantity: number; variantTitle: string | null }>;
};

export const getCurrentCustomer = cache(async (): Promise<CurrentCustomer | null> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  let session: CustomerSession;
  try { session = JSON.parse(raw) as CustomerSession; }
  catch { return null; }

  if (!session.token || new Date(session.expiresAt) < new Date()) return null;

  try {
    type Resp = { customer: CurrentCustomer | null };
    const data = await shopifyStorefrontFetch<Resp>(
      `query getCustomer($token: String!) {
        customer(customerAccessToken: $token) {
          id email firstName lastName phone displayName
        }
      }`,
      { token: session.token },
    );
    return data.customer;
  } catch { return null; }
});

export async function getCurrentCustomerOrders(): Promise<CustomerOrder[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return [];

  let session: CustomerSession;
  try { session = JSON.parse(raw) as CustomerSession; }
  catch { return []; }
  if (!session.token) return [];

  try {
    type Resp = {
      customer: {
        orders: {
          edges: Array<{
            node: {
              id: string; orderNumber: number; processedAt: string;
              financialStatus: string | null; fulfillmentStatus: string | null;
              totalPrice: { amount: string; currencyCode: string };
              statusUrl: string;
              lineItems: { edges: Array<{ node: { title: string; quantity: number; variantTitle: string | null } }> };
            };
          }>;
        };
      } | null;
    };
    const data = await shopifyStorefrontFetch<Resp>(
      `query getOrders($token: String!) {
        customer(customerAccessToken: $token) {
          orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
            edges {
              node {
                id orderNumber processedAt financialStatus fulfillmentStatus
                totalPrice { amount currencyCode }
                statusUrl
                lineItems(first: 25) {
                  edges { node { title quantity variantTitle } }
                }
              }
            }
          }
        }
      }`,
      { token: session.token },
    );

    return (data.customer?.orders.edges ?? []).map((e) => ({
      id: e.node.id,
      orderNumber: e.node.orderNumber,
      processedAt: e.node.processedAt,
      financialStatus: e.node.financialStatus,
      fulfillmentStatus: e.node.fulfillmentStatus,
      totalPrice: e.node.totalPrice,
      statusUrl: e.node.statusUrl,
      lineItems: e.node.lineItems.edges.map((li) => ({
        title: li.node.title,
        quantity: li.node.quantity,
        variantTitle: li.node.variantTitle,
      })),
    }));
  } catch { return []; }
}

export async function getCurrentSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as CustomerSession;
    if (!session.token || new Date(session.expiresAt) < new Date()) return null;
    return session.token;
  } catch { return null; }
}

export async function setCustomerSession(session: CustomerSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/", expires: new Date(session.expiresAt),
  });
}

export async function requireCustomerOr401(): Promise<CurrentCustomer | import("next/server").NextResponse> {
  const { NextResponse } = await import("next/server");
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "Login required", loginRequired: true }, { status: 401 });
  return customer;
}

export async function clearCustomerSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  cookieStore.delete(SESSION_COOKIE);
  if (!raw) return null;
  try { return (JSON.parse(raw) as CustomerSession).token; }
  catch { return null; }
}
