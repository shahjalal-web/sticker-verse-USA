import Link from "next/link";
import { getCurrentCustomer, getCurrentCustomerOrders } from "@/lib/customer-session";

export default async function AccountPage() {
  const [customer, orders] = await Promise.all([
    getCurrentCustomer(),
    getCurrentCustomerOrders(),
  ]);

  if (!customer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-2" style={{ fontFamily: "var(--font-orbitron)" }}>Account</p>
        <h1 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>You're not signed in</h1>
        <p className="text-gray-500 mb-8">Sign in to view your orders and account details.</p>
        <div className="flex gap-4">
          <Link href="/login" className="border border-white/20 px-6 py-2.5 text-sm text-white hover:bg-white hover:text-black transition-colors tracking-widest uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>
            Sign In
          </Link>
          <Link href="/signup" className="bg-white px-6 py-2.5 text-sm text-black font-semibold hover:bg-gray-100 transition-colors tracking-widest uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-white/5">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>Account</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
          Hi, {customer.firstName ?? customer.email.split("@")[0]}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{customer.email}</p>
      </div>

      {/* Profile */}
      <section className="mb-10">
        <h2 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>Profile</h2>
        <div className="bg-white/3 border border-white/5 p-6 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Name</p>
            <p className="text-white">{[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Email</p>
            <p className="text-white">{customer.email}</p>
          </div>
          {customer.phone && (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Phone</p>
              <p className="text-white">{customer.phone}</p>
            </div>
          )}
        </div>
      </section>

      {/* Orders */}
      <section>
        <h2 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
          Order History
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white/3 border border-white/5 p-8 text-center">
            <p className="text-gray-500 text-sm">No orders yet.</p>
            <Link href="/#categories" className="mt-4 inline-block text-xs tracking-widest uppercase text-white border border-white/20 px-5 py-2 hover:bg-white hover:text-black transition-colors" style={{ fontFamily: "var(--font-orbitron)" }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/3 border border-white/5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-orbitron)" }}>
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(order.processedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.financialStatus && (
                      <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold ${order.financialStatus === "PAID" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                        {order.financialStatus}
                      </span>
                    )}
                    {order.fulfillmentStatus && (
                      <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold ${order.fulfillmentStatus === "FULFILLED" ? "bg-blue-500/15 text-blue-400" : "bg-gray-500/15 text-gray-400"}`}>
                        {order.fulfillmentStatus}
                      </span>
                    )}
                    <span className="text-white text-sm font-medium">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: order.totalPrice.currencyCode }).format(Number(order.totalPrice.amount))}
                    </span>
                  </div>
                </div>
                <ul className="text-xs text-gray-500 flex flex-col gap-1 mb-3">
                  {order.lineItems.map((item, i) => (
                    <li key={i}>{item.quantity}× {item.title}{item.variantTitle ? ` — ${item.variantTitle}` : ""}</li>
                  ))}
                </ul>
                <a href={order.statusUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-2">
                  View order →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Logout */}
      <div className="mt-12">
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="text-sm text-gray-500 hover:text-white transition-colors border border-white/10 px-5 py-2">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
