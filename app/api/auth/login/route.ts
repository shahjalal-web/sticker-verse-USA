import { type NextRequest, NextResponse } from "next/server";
import { shopifyStorefrontFetch } from "@/lib/shopify-storefront";
import { setCustomerSession } from "@/lib/customer-session";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  if (!email || !password)
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

  try {
    type Resp = {
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: Array<{ code: string; message: string }>;
      };
    };
    const data = await shopifyStorefrontFetch<Resp>(
      `mutation login($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken { accessToken expiresAt }
          customerUserErrors { code message }
        }
      }`,
      { input: { email, password } },
    );

    const errors = data.customerAccessTokenCreate.customerUserErrors;
    if (errors.length || !data.customerAccessTokenCreate.customerAccessToken) {
      return NextResponse.json(
        { error: "Invalid email or password. If you've never set a password, use 'Forgot password?' to create one.", mayNeedPasswordSetup: true },
        { status: 401 },
      );
    }

    const tok = data.customerAccessTokenCreate.customerAccessToken;
    await setCustomerSession({ token: tok.accessToken, expiresAt: tok.expiresAt });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Login failed" }, { status: 500 });
  }
}
