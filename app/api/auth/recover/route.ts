import { type NextRequest, NextResponse } from "next/server";
import { shopifyStorefrontFetch } from "@/lib/shopify-storefront";

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const email = body.email?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const genericMessage = "If an account exists for that email, we've sent a password reset link. Check your inbox (and spam folder).";

  try {
    type Resp = { customerRecover: { customerUserErrors: Array<{ code: string; message: string }> } };
    const data = await shopifyStorefrontFetch<Resp>(
      `mutation recover($email: String!) {
        customerRecover(email: $email) {
          customerUserErrors { code message }
        }
      }`,
      { email },
    );

    const throttled = data.customerRecover.customerUserErrors.find((e) => e.code === "TOO_MANY_REQUESTS");
    if (throttled) return NextResponse.json({ error: throttled.message || "Too many requests. Please wait a few minutes." }, { status: 429 });

    return NextResponse.json({ ok: true, message: genericMessage });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Could not send reset email" }, { status: 500 });
  }
}
