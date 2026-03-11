"use server"

import { prisma, cloudinary } from "@/db/db";
import { z } from "zod";
import sharp from "sharp";
import { notFound, redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

type CloudinaryResult = { public_id: string; secure_url: string }

const fileSchema = z.instanceof(File, {message :  "File is required"})
const imageSchema = fileSchema.refine(file=> file.size === 0 || file.type.startsWith("image/"))

const addSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().int().min(1),
    description: z.string().min(1),
    file: fileSchema.refine(file=> file.size > 0, {message: "File is required"}),
    image: imageSchema.refine(file=> file.size > 0, {message: "Image is required"})
})


export async function addProduct(prevState: unknown, formData: FormData){
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
    if(result.success == false){
       return result.error.formErrors.fieldErrors
    }
    const data  = result.data;
    // read buffers from the uploaded files
    const rawImage = Buffer.from(await data.image.arrayBuffer());
    const actualImage = await sharp(rawImage)
    .resize({ width: 1024, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
    const actualFile = Buffer.from(await data.file.arrayBuffer());

    // compress/resize the image before sending to Cloudinary
    // you can tweak width/quality as needed

    const uuid = crypto.randomUUID();
    const filePath = `products/images/${uuid}-${data.file.name}`
    const imagePath = `products/images/${uuid}-${data.image.name}`

    // Upload image to Cloudinary
    let imageUploadResult: CloudinaryResult | undefined;
    try {
        imageUploadResult = await new Promise<CloudinaryResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'products/images',
                    public_id: `${uuid}-${data.image.name.split('.')[0]}`,
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (result) resolve(result);
                    else reject(new Error("No result returned from Cloudinary"));
                }
            );
            uploadStream.end(actualImage);
        });
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return { general: "Failed to upload image" };
    }

    // Upload file to Cloudinary
    try {
        await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'products/files',
                    public_id: `${uuid}-${data.file.name.split('.')[0]}`,
                    resource_type: 'raw'
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (result) resolve(result);
                    else reject(new Error("No result returned from Cloudinary"));
                }
            );
            uploadStream.end(actualFile);
        });
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        // Try to delete the image if file upload failed
        try {
            if (imageUploadResult?.public_id) {
                await cloudinary.uploader.destroy(imageUploadResult.public_id, { resource_type: 'image' });
            }
        } catch (cleanupError) {
            console.error("Error cleaning up image after file upload failure:", cleanupError);
        }
        return { general: "Failed to upload file" };
    }


    await prisma.product.create({data: {
        name: data.name,
        description: data.description,
        price: data.price,
        filePath,
        imagePath,
        isAvailableForPurchase: true
    }})
    revalidateTag("products")
    redirect("/admin/products");
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

    
    

