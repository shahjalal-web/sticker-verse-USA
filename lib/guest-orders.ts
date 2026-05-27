"use client";

const GUEST_ORDERS_KEY = "sv_guest_orders";

export type GuestOrder = {
  draftOrderId: number;
  email: string;
  total: number;
  items: Array<{ title: string; quantity: number }>;
  createdAt: number;
  invoiceUrl: string;
  migrated?: boolean;
};

export function readGuestOrders(): GuestOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function addGuestOrder(order: GuestOrder): void {
  if (typeof window === "undefined") return;
  const existing = readGuestOrders();
  const deduped = existing.filter((o) => o.draftOrderId !== order.draftOrderId);
  window.localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify([order, ...deduped]));
}

export function markGuestOrdersMigrated(ids: number[]): void {
  if (typeof window === "undefined") return;
  const orders = readGuestOrders().map((o) =>
    ids.includes(o.draftOrderId) ? { ...o, migrated: true } : o
  );
  window.localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(orders));
}

export function removeGuestOrder(draftOrderId: number): void {
  if (typeof window === "undefined") return;
  const orders = readGuestOrders().filter((o) => o.draftOrderId !== draftOrderId);
  window.localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(orders));
}
