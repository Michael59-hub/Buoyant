"use server"

import { auth } from "@/auth"
import { prisma } from "@/db/db"
import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().int().min(1),
  category: z.string().min(1),
  imagePath: z.string().min(1),
  filePath: z.string().min(1),
})

export async function addVendorProduct(prevState: unknown, formData: FormData) {
  const session = await auth()
  const vendorId = session?.user?.id

  if (!vendorId || session?.user?.role !== "vendor") {
    return { general: "Unauthorized" }
  }

  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) return result.error.formErrors.fieldErrors

  const data = result.data

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        filePath: data.filePath,
        imagePath: data.imagePath,
        isAvailableForPurchase: false, // drafts off by default
        category: data.category,
        vendorId,
      },
    })
  } catch {
    return { general: "Failed to save product. Please try again." }
  }

  revalidatePath("/vendor/products")
  revalidatePath("/products")
  redirect("/vendor/products")
}

export async function updateVendorProduct(id: string, prevState: unknown, formData: FormData) {
  const session = await auth()
  const vendorId = session?.user?.id

  if (!vendorId || session?.user?.role !== "vendor") {
    return { general: "Unauthorized" }
  }

  // Make sure this product belongs to this vendor
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing || existing.vendorId !== vendorId) {
    return { general: "Product not found" }
  }

  const editSchema = addSchema.partial({ imagePath: true, filePath: true })
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) return result.error.formErrors.fieldErrors

  const data = result.data

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      ...(data.imagePath && { imagePath: data.imagePath }),
      ...(data.filePath && { filePath: data.filePath }),
    },
  })

  revalidatePath("/vendor/products")
  revalidatePath("/products")
  redirect("/vendor/products")
}