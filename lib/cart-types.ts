export type CartItemKind = "product" | "vinyl-sticker";

export interface CartItemBase {
  id: string;
  addedAt: number;
  title: string;
  subtitle: string;
  thumbnail: string;
  unitLabel: string;
  totalPrice: number;
  quantity: number;
  editHref?: string;
}

export interface ProductCartItem extends CartItemBase {
  kind: "product";
  variantId: string;
  productTitle: string;
  selectedOptions: Record<string, string>;
  qty: number;
  unitPrice: number;
  extraProperties?: Record<string, string>;
}

export interface VinylStickerCartItem extends CartItemBase {
  kind: "vinyl-sticker";
  shape: string;
  material: string;
  size: string;
  customWidth?: number;
  customHeight?: number;
  roundedCorners: boolean | null;
  tierQty: number;
  perUnit: number;
  fileUrl?: string;
  fileName?: string;
  instructions?: string;
  proof?: {
    status: "approved" | "changes-requested";
    proofUrl?: string;
    cutlineUrl?: string;
    shape: string;
    borderThickness: string;
    roundedCorners: string;
    removedBackground: boolean;
    lowResolution: boolean;
    changeNote?: string;
  };
}

export type CartItem = ProductCartItem | VinylStickerCartItem;
