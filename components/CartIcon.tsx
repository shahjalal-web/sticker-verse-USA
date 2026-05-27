"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export default function CartIcon() {
  const { itemCount, isHydrated } = useCart();
  const count = isHydrated ? itemCount : 0;

  return (
    <Link href="/cart" className="relative flex items-center justify-center w-9 h-9 text-gray-300 hover:text-white transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" x2="21" y1="6" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-black text-[10px] font-bold leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
