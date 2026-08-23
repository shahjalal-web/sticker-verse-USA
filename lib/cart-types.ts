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
  cutType?: string;
  shape: string;
  material: string;
  finish?: string;
  size: string;
  customWidth?: number;
  customHeight?: number;
  roundedCorners: boolean | null;
  tierQty: number;
  perUnit: number;
  fileUrl?: string;
  fileName?: string;
  instructions?: string;
  /** Static cling only: which side of the glass this design gets applied to. */
  placement?: "inside" | "outside";
  proof?: {
    status: "approved" | "changes-requested";
    proofUrl?: string;
    cutlineUrl?: string;
    designUrl?: string;
    /** Vector cutline (SVG) for the Graphtec cutter — the real production cut path, not the raster preview. */
    cutFileUrl?: string;
    /** Production PDF: artwork + vector CutContour path, ready for Illustrator/Cutting Master. */
    productionPdfUrl?: string;
    shape: string;
    fitMode: string;
    borderThickness: string;
    roundedCorners: string;
    removedBackground: boolean;
    lowResolution: boolean;
    cutlineColor?: string;
    bgColor?: string;
    changeNote?: string;
  };
}

export type CartItem = ProductCartItem | VinylStickerCartItem;
