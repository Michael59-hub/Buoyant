// lib/cache.ts
import { cache } from "react"
import { unstable_cache } from "next/cache"
import { prisma } from "@/db/db"

export const getProducts = unstable_cache(
  async () => {
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
    })
  },
  ["all-products"],
  { revalidate: 3600, tags: ["products"] } // cache for 1 hour, revalidate on mutation
)

export const getProductById = unstable_cache(
  async (id: string) => {
    return prisma.product.findUnique({ where: { id } })
  },
  ["product"],
  { revalidate: 3600, tags: ["products"] }
)