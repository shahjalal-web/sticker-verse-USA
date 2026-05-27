import { type NextRequest, NextResponse } from "next/server";
import { shopifyStorefrontFetch } from "@/lib/shopify-storefront";
import { clearCustomerSession } from "@/lib/customer-session";

export async function POST(req: NextRequest) {
  const token = await clearCustomerSession();
  if (token) {
    try {
      await shopifyStorefrontFetch(
        `mutation logout($token: String!) {
          customerAccessTokenDelete(customerAccessToken: $token) {
            deletedAccessToken userErrors { field message }
          }
        }`,
        { token },
      );
    } catch { }
  }

  const acceptsJson = req.headers.get("accept")?.includes("application/json");
  if (acceptsJson) return NextResponse.json({ ok: true });
  return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}
