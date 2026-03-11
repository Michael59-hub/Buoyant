import { prisma } from "@/db/db"
import CatalogClient from "./CatalogClient"
import { getProducts } from "@/lib/cache"

export default async function ProductsPage() {
  const products = await getProducts()

  // Serialize dates so they can be passed to a client component
  const serialized = products.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt).toISOString(),
    updatedAt: new Date(p.updatedAt).toISOString(),
  }))

  return <CatalogClient products={serialized} />
}
