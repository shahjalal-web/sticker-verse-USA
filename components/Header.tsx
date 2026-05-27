import { getCurrentCustomer } from "@/lib/customer-session";
import { getAllCollections } from "@/lib/shopify-collections";
import HeaderClient, { type HeaderCollection } from "./HeaderClient";

export default async function Header() {
  const [customer, collections] = await Promise.allSettled([
    getCurrentCustomer(),
    getAllCollections(),
  ]);

  const customerData = customer.status === "fulfilled" ? customer.value : null;
  const collectionsData: HeaderCollection[] = collections.status === "fulfilled"
    ? collections.value.map((c) => ({ handle: c.handle, title: c.title }))
    : [];

  return (
    <HeaderClient
      customer={customerData ? { firstName: customerData.firstName, displayName: customerData.displayName, email: customerData.email } : null}
      collections={collectionsData}
    />
  );
}
