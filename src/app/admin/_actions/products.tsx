"use server"

import { prisma } from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { createClient} from "@supabase/supabase-js"
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, {message :  "File is required"})
const imageSchema = fileSchema.refine(file=> file.size === 0 || file.type.startsWith("image/"))
const supabase = createClient(process.env.PROJECT_URL!, process.env.SUPABASE_ANON_KEY!);

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
    const actualImage = Buffer.from(await data.image.arrayBuffer());
    const actualFile = Buffer.from(await data.file.arrayBuffer());
    const uuid = crypto.randomUUID();
    const filePath = `products/${uuid}-${data.file.name}`
    const imagePath = `products/${uuid}-${data.image.name}`
    await supabase.storage.from("images").upload(imagePath, actualImage, {
        cacheControl: "3600",
        upsert: true
    }).then(({error})=>{
        if(error) {
            console.error("Error uploading image to Supabase:", error);
        }
    })
    const ImagePublicUrl = supabase.storage.from('images').getPublicUrl(imagePath).data.publicUrl;
    const FilePublicUrl = supabase.storage.from('files').getPublicUrl(filePath).data.publicUrl;
    console.log('Image Public URL:', ImagePublicUrl)
    console.log('Public URL:', FilePublicUrl)
    await supabase.storage.from("files").upload(filePath, actualFile, {
        cacheControl: "3600",
        upsert: true
    }).then(({error})=>{
        if(error) {
            console.error("Error uploading file to Supabase:", error);
        }
    })
    await fs.mkdir("products", {recursive: true})
    
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir("public/products", {recursive: true})
    
    await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    await prisma.product.create({data: {
        name: data.name,
        description: data.description,
        price: data.price,
        filePath,
        imagePath,
        isAvailableForPurchase: true
    }})
    revalidatePath("/");
    revalidatePath("/products");
    redirect("/admin/products");
}


export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean){
    await prisma.product.update({
        where: {id},
        data: {isAvailableForPurchase}
    })
    revalidatePath("/");
    revalidatePath("/products");
}


export async function deleteProduct(id: string){
    // const product = await prisma.product.findUnique({
    //     where: {id},
    //     select: {
    //         filePath: true,
    //         imagePath: true
    //     }
    // })
    // if(!product) return;
    // await fs.unlink(product.filePath)
    // await fs.unlink(product.imagePath)
    const product = await prisma.product.delete({where: {id}})
    if(product == null) return notFound()
    try{  
        await fs.unlink(product.filePath)
        await fs.unlink(`public/${product.imagePath}`)
    }catch(err){
        console.error(err);
        return {general : "File or image path does not match"}
    }


    revalidatePath("/");
    revalidatePath("/products");
    
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
    if(data.file != null && data.file.size > 0){
        await fs.unlink(product.filePath)
        filePath = `products/${crypto.randomUUID()}-${data.file.name} `
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
    }
    if(data.image != null && data.image.size > 0){
        await fs.unlink(`public/${product.imagePath}`)
        imagePath = `products/${crypto.randomUUID()}-${data.image.name} `
        await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
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

    revalidatePath("/");
    revalidatePath("/products");
    redirect("/admin/products");
}

    
    

