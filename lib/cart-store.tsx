"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "./cart-types";
import { computeDiscountAmount, type CartDiscount } from "./discount-types";

const STORAGE_KEY = "sv_cart";
const DISCOUNT_KEY = "sv_discount";
const PENDING_KEY = "sv_pending_checkout";

export type PendingCheckout = {
  draftOrderId: number;
  invoiceUrl: string;
  createdAt: number;
};

type CartContextValue = {
  isHydrated: boolean;
  items: CartItem[];
  itemCount: number;
  lineCount: number;
  subtotal: number;
  discount: CartDiscount | null;
  discountAmount: number;
  total: number;
  pendingCheckout: PendingCheckout | null;
  addItem: (item: Omit<CartItem, "id" | "addedAt"> & Partial<Pick<CartItem, "id" | "addedAt">>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, newQty: number) => void;
  clearCart: () => void;
  applyDiscount: (discount: CartDiscount) => void;
  clearDiscount: () => void;
  setPendingCheckout: (p: PendingCheckout) => void;
  clearPendingCheckout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function safeRead(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function safeWrite(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { }
}

function safeReadDiscount(): CartDiscount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DISCOUNT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CartDiscount;
    return parsed?.code && parsed?.valueType ? parsed : null;
  } catch { return null; }
}

function safeWriteDiscount(d: CartDiscount | null) {
  if (typeof window === "undefined") return;
  try {
    if (d) window.localStorage.setItem(DISCOUNT_KEY, JSON.stringify(d));
    else window.localStorage.removeItem(DISCOUNT_KEY);
  } catch { }
}

function safeReadPending(): PendingCheckout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingCheckout;
    if (!parsed?.draftOrderId || !parsed?.invoiceUrl) return null;
    if (Date.now() - parsed.createdAt > 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch { return null; }
}

function safeWritePending(p: PendingCheckout | null) {
  if (typeof window === "undefined") return;
  try {
    if (p) window.localStorage.setItem(PENDING_KEY, JSON.stringify(p));
    else window.localStorage.removeItem(PENDING_KEY);
  } catch { }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => safeRead());
  const [discount, setDiscount] = useState<CartDiscount | null>(() => safeReadDiscount());
  const [pendingCheckout, setPendingCheckoutState] = useState<PendingCheckout | null>(() => safeReadPending());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { setIsHydrated(true); }, []);
  useEffect(() => { if (isHydrated) safeWrite(items); }, [items, isHydrated]);
  useEffect(() => { if (isHydrated) safeWriteDiscount(discount); }, [discount, isHydrated]);
  useEffect(() => { if (isHydrated) safeWritePending(pendingCheckout); }, [pendingCheckout, isHydrated]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setItems(safeRead());
      if (e.key === DISCOUNT_KEY) setDiscount(safeReadDiscount());
      if (e.key === PENDING_KEY) setPendingCheckoutState(safeReadPending());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    function resync() {
      setItems(safeRead());
      setDiscount(safeReadDiscount());
      setPendingCheckoutState(safeReadPending());
    }
    window.addEventListener("pageshow", resync);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") resync(); });
    window.addEventListener("focus", resync);
    return () => {
      window.removeEventListener("pageshow", resync);
      window.removeEventListener("focus", resync);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (items.length === 0) {
      const local = safeRead();
      if (local.length > 0) setItems(local);
    }
  }, [items, isHydrated]);

  const addItem = useCallback<CartContextValue["addItem"]>((item) => {
    setItems((prev) => {
      const newItem: CartItem = {
        ...(item as CartItem),
        id: item.id ?? `${item.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        addedAt: item.addedAt ?? Date.now(),
      };
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, newQty: number) => {
    if (newQty <= 0) { setItems((prev) => prev.filter((i) => i.id !== id)); return; }
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      if (i.kind === "product") return { ...i, qty: newQty, quantity: newQty, totalPrice: i.unitPrice * newQty };
      return i;
    }));
  }, []);

  const clearCart = useCallback(() => { setItems([]); setDiscount(null); setPendingCheckoutState(null); }, []);
  const applyDiscount = useCallback((d: CartDiscount) => setDiscount(d), []);
  const clearDiscount = useCallback(() => setDiscount(null), []);
  const setPendingCheckout = useCallback((p: PendingCheckout) => setPendingCheckoutState(p), []);
  const clearPendingCheckout = useCallback(() => setPendingCheckoutState(null), []);

  const itemCount = useMemo(() => items.reduce((s, i) => s + (i.quantity || 0), 0), [items]);
  const lineCount = items.length;
  const subtotal = useMemo(() => items.reduce((s, i) => s + (i.totalPrice || 0), 0), [items]);

  useEffect(() => {
    if (!isHydrated || !discount) return;
    if (typeof discount.minimumSubtotal === "number" && subtotal > 0 && subtotal < discount.minimumSubtotal) setDiscount(null);
  }, [subtotal, discount, isHydrated]);

  const discountAmount = useMemo(() => computeDiscountAmount(discount, subtotal), [discount, subtotal]);
  const total = useMemo(() => Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100), [subtotal, discountAmount]);

  const value: CartContextValue = useMemo(() => ({
    isHydrated, items, itemCount, lineCount, subtotal, discount, discountAmount, total, pendingCheckout,
    addItem, removeItem, updateQty, clearCart, applyDiscount, clearDiscount, setPendingCheckout, clearPendingCheckout,
  }), [isHydrated, items, itemCount, lineCount, subtotal, discount, discountAmount, total, pendingCheckout,
    addItem, removeItem, updateQty, clearCart, applyDiscount, clearDiscount, setPendingCheckout, clearPendingCheckout]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
