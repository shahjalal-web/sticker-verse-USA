import { type NextRequest, NextResponse } from "next/server";
import { shopifyStorefrontFetch } from "@/lib/shopify-storefront";
import { setCustomerSession } from "@/lib/customer-session";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; firstName?: string; lastName?: string; phone?: string; acceptsMarketing?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const firstName = body.firstName?.trim() || undefined;
  const lastName = body.lastName?.trim() || undefined;
  const phone = body.phone?.trim().startsWith("+") ? body.phone.trim() : undefined;

  if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  if (!firstName) return NextResponse.json({ error: "First name is required" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

  try {
    type CreateResp = {
      customerCreate: {
        customer: { id: string } | null;
        customerUserErrors: Array<{ code: string; message: string }>;
      };
    };
    const createData = await shopifyStorefrontFetch<CreateResp>(
      `mutation signup($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer { id }
          customerUserErrors { code message }
        }
      }`,
      { input: { email, password, firstName, lastName, phone, acceptsMarketing: Boolean(body.acceptsMarketing) } },
    );

    const createErrors = createData.customerCreate.customerUserErrors;
    if (createErrors.length || !createData.customerCreate.customer) {
      const first = createErrors[0];
      const msg = first?.code === "TAKEN" ? "An account with this email already exists. Try logging in." : (first?.message ?? "Could not create account");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    type TokenResp = {
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: Array<{ code: string; message: string }>;
      };
    };
    const tokenData = await shopifyStorefrontFetch<TokenResp>(
      `mutation login($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken { accessToken expiresAt }
          customerUserErrors { code message }
        }
      }`,
      { input: { email, password } },
    );

    if (tokenData.customerAccessTokenCreate.customerUserErrors.length || !tokenData.customerAccessTokenCreate.customerAccessToken) {
      return NextResponse.json({ ok: true, requiresManualLogin: true, message: "Account created. Please log in." });
    }

    const tok = tokenData.customerAccessTokenCreate.customerAccessToken;
    await setCustomerSession({ token: tok.accessToken, expiresAt: tok.expiresAt });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Signup failed" }, { status: 500 });
  }
}
