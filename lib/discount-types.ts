export type DiscountValueType = "percentage" | "fixed_amount" | "shipping";

export interface CartDiscount {
  code: string;
  title: string;
  valueType: DiscountValueType;
  value: number;
  minimumSubtotal?: number;
}

export function computeDiscountAmount(discount: CartDiscount | null, subtotal: number): number {
  if (!discount || subtotal <= 0) return 0;
  if (typeof discount.minimumSubtotal === "number" && subtotal < discount.minimumSubtotal) return 0;
  if (discount.valueType === "percentage") return Math.round(((subtotal * discount.value) / 100) * 100) / 100;
  if (discount.valueType === "fixed_amount") return Math.min(discount.value, subtotal);
  return 0;
}
