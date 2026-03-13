"use server"

import { prisma } from "@/db/db";
import { cloudinary } from "@/lib/cloudinary";
import { z } from "zod";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


const fileSchema = z.instanceof(File, {message :  "File is required"})
const imageSchema = fileSchema.refine(file=> file.size === 0 || file.type.startsWith("image/"))

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().int().min(1),
  category: z.string().min(1),
  imagePath: z.string().min(1),
  filePath: z.string().min(1),
})


export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  
  console.log("Form data received:", Object.fromEntries(formData.entries()))
  
  if (result.success == false) {
    console.log("Validation errors:", result.error.formErrors.fieldErrors)
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  console.log("Parsed data:", data)

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        filePath: data.filePath,
        imagePath: data.imagePath,
        isAvailableForPurchase: true,
        category: data.category,
      }
    })
  } catch (err) {
    console.error("Prisma error:", err)
    return { general: "Failed to save product to database" }
  }

  revalidatePath("/admin/products", "layout")
  revalidatePath("/products", "layout")
  redirect("/admin/products")
}


export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean){
    await prisma.product.update({
        where: {id},
        data: {isAvailableForPurchase}
    })

}


export async function deleteProduct(id: string){
    const product = await prisma.product.findUnique({
        where: {id},
        select: {
            filePath: true,
            imagePath: true
        }
    })
    if(!product) return notFound();

    // Delete from Cloudinary
    try {
        // Extract public IDs from paths (assuming format: products/images/uuid-filename or products/files/uuid-filename)
        const imagePublicId = `products/images/${product.imagePath.split('/').pop()?.split('.')[0]}`;
        const filePublicId = `products/files/${product.filePath.split('/').pop()?.split('.')[0]}`;

        await Promise.all([
            cloudinary.uploader.destroy(imagePublicId, { resource_type: 'image' }),
            cloudinary.uploader.destroy(filePublicId, { resource_type: 'raw' })
        ]);
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        // Continue with local file deletion even if Cloudinary deletion fails
    }



    await prisma.product.delete({where: {id}})
}

const editSchema = addSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional()
})

export async function updateProduct(id: string , prevState: unknown, formData: FormData){
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
    if(result.success == false){
       return result.error.formErrors.fieldErrors
    }

    const data  = result.data;
    const product = await prisma.product.findUnique({where: {id}})
    if(product == null){
        return notFound()
    }
    let filePath = product.filePath
    let imagePath = product.imagePath
    if (data.file != null && data.file.size > 0) {
        filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    }
    if (data.image != null && data.image.size > 0) {
        imagePath = `products/${crypto.randomUUID()}-${data.image.name}`;
    }
    await prisma.product.update({
        where: {id},
        data:  {
            name: data.name,
            description: data.description,
            price: data.price,
            filePath,
            imagePath,
        },
    })
    redirect("/admin/products");
}

    
    

