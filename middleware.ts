import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_STORE = "stickerverseusa.myshopify.com";
const SHOP_ID = "78810906940";

// All path prefixes that Shopify must handle
const SHOPIFY_PREFIXES = [
  `/${SHOP_ID}`,
  "/checkout",
  "/checkouts",
  "/do",
  "/a/",
  "/services",
  "/payments",
  "/orders",
  "/account",
  "/auth",
  "/login",
  "/pay",
  "/cart",
  "/apps",
  "/community",
  "/challenge",
  "/csp-report",
  "/offline",
  "/password",
  "/policies",
  "/search",
  "/gift_cards",
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isShopifyPath = SHOPIFY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/") || pathname.startsWith(prefix + "?")
  );

  if (isShopifyPath) {
    const destination = `https://${SHOPIFY_STORE}${pathname}${search}`;
    return NextResponse.redirect(destination, { status: 307 });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)"],
};
