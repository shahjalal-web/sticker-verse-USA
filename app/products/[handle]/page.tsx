import { notFound } from "next/navigation";
import { getProductByHandle, isStickerProduct } from "@/lib/shopify-products";
import StickerConfigurator from "@/components/StickerConfigurator";
import GenericProductPage from "@/components/GenericProductPage";

type Props = { params: Promise<{ handle: string }> };

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  if (isStickerProduct(product)) {
    return <StickerConfigurator product={product} />;
  }

  return <GenericProductPage product={product} />;
}
